import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { sendMessage, onMessage, initSignaling } from "../util/signaling";
import type { ClientId, SignalMsg } from "../util/signaling"
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
  useEffect(() => {
    fetch(`${import.meta.env.VITE_HTTP_SERVER_URL}/id`)
      .then(res => res.json())
      .then(data => setClientId(data));

    const socket = createSocket();
    
    socket.addEventListener("open", () => {
      setWebSocketOpen(true);
      console.log("Connected to server");
    });

    socket.addEventListener("close", () => {
      setWebSocketOpen(false);
      console.log("Disconnected from server");
    });

    initSignaling();

    const unsubscribe = onMessage((msg: SignalMsg) => {
      console.log(msg);
    });

    return () => { socket.close(); unsubscribe() };
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
