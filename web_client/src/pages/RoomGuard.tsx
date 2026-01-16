import type { ReactNode } from "react";
import { useSignaling } from "../context/SignalingContext";
import { Navigate, useLocation } from "react-router-dom";

export function RoomGuard({ children }: { children: ReactNode }) {
  const { webSocketOpen } = useSignaling();
  const location = useLocation();

  if (!webSocketOpen) {
    return (
      <Navigate
        to="/offline"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}

