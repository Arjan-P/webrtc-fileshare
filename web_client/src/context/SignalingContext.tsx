import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from "react";
import { sendMessage, onMessage, initSignaling } from "../util/signaling";
import type { ClientId } from "../util/signaling"
import { createSocket } from "../util/socket";

interface SignalingContextType {
  id: ClientId;
  webSocketOpen: boolean;
  sendMessage: typeof sendMessage;
  onMessage: typeof onMessage;
}

const SignalingContext = createContext<SignalingContextType | null>(null);

export function SignalingProvider({ children }: { children: ReactNode }) {
  const [clientId, setClientId] = useState<ClientId>("");
  const [webSocketOpen, setWebSocketOpen] = useState<boolean>(false);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);
  const reconnectAttempts = useRef(0);

  fetch(`${import.meta.env.VITE_HTTP_SERVER_URL}/id`)
    .then(res => res.json())
    .then(data => setClientId(data));
  useEffect(() => {
    let disposed = false;

    function connect() {
      if (disposed) return;

      const socket = createSocket();
      socketRef.current = socket;

      socket.addEventListener("open", () => {
        reconnectAttempts.current = 0;
        setWebSocketOpen(true);
        console.log("WebSocket connected");
      });

      socket.addEventListener("close", () => {
        setWebSocketOpen(false);
        socketRef.current = null;
        console.log("WebSocket disconnected");

        scheduleReconnect();
      });

      socket.addEventListener("error", () => {
        socket.close();
      });

      initSignaling();
    }

    function scheduleReconnect() {
      if (disposed) return;
      if (reconnectTimerRef.current) return;
      console.log("scheduling reconnect");

      const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 10_000);
      reconnectAttempts.current++;

      reconnectTimerRef.current = window.setTimeout(() => {
        reconnectTimerRef.current = null;
        connect();
      }, delay);
    }

    connect();

    return () => {
      disposed = true;
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      socketRef.current?.close();
    };
  }, []);
  return (
    <SignalingContext.Provider value={{ id: clientId,webSocketOpen, sendMessage, onMessage }}>
      {children}
    </SignalingContext.Provider>
  )
}

export function useSignaling() {
  const cntx = useContext(SignalingContext);
  if (!cntx) {
    throw new Error("useSignaling must be used within a SignalingProvider");
  }
  return cntx;
}
