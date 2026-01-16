import type { ReactNode } from "react";
import { useSignaling } from "../context/SignalingContext";
import { Navigate } from "react-router-dom";

export function RoomGuard({children} : {children: ReactNode}) {
  const {webSocketOpen} = useSignaling();

  if(!webSocketOpen) {
    return <Navigate to={"/offline"} replace />
  }
  return children
}
