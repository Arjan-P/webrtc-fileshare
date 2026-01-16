import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { sendMessage, onMessage, initSignaling } from "../util/signaling";
import type { ClientId, SignalMsg } from "../util/signaling"
import { createSocket } from "../util/socket";
import { useNavigate } from "react-router-dom";

interface SignalingContextType {
  id: ClientId;
  sendMessage: typeof sendMessage;
  onMessage: typeof onMessage;
}

const SignalingContext = createContext<SignalingContextType | null>(null);

export function SignalingProvider({ children }: { children: ReactNode }) {
  const [clientId, setClientId] = useState<ClientId>("");
  const navigate = useNavigate();
  useEffect(() => {
    fetch(`${import.meta.env.VITE_HTTP_SERVER_URL}/id`)
      .then(res => res.json())
      .then(data => setClientId(data));

    const socket = createSocket();
    socket.addEventListener("open", () => {
      console.log("Connected to server");
    });

    socket.addEventListener("close", () => {
      navigate("/");
      console.log("Disconnected from server");
    });

    initSignaling();

    const unsubscribe = onMessage((msg: SignalMsg) => {
      console.log(msg);
    });

    return () => { socket.close(); unsubscribe() };
  }, []);
  return (
    <SignalingContext.Provider value={{ id: clientId, sendMessage, onMessage }}>
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
