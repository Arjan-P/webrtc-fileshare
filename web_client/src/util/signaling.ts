import { getSocket } from "./socket";

export type ClientId = string;
export type SignalMsg =
  { type: "offer"; from: ClientId; to: ClientId; offer: RTCSessionDescriptionInit }
  |
  { type: "answer"; from: ClientId; to: ClientId; answer: RTCSessionDescriptionInit }
  |
  { type: "new-ice-candidates"; from: ClientId; to: ClientId; ice: RTCIceCandidateInit }
  |
  { type: "new-connection"; id: ClientId; peers: ClientId[] }
  |
  { type: "peer-join"; id: ClientId }
  |
  { type: "peer-left"; id: ClientId }

type Handler = (msg: SignalMsg) => void;
const handlers = new Set<Handler>();

export function createSocket() {
  const socket = getSocket();
  return socket;
}

export function sendMessage(msg: SignalMsg) {
  const socket = getSocket();
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(msg));
  } else {
    console.error("Connection not open yet");
  }
}

export function initSignaling() {
  const socket = getSocket();
  socket.addEventListener("message", (event) => {
    try {
      const msg = JSON.parse(event.data);

      if (!msg || typeof msg.type !== "string") {
        console.error("Invalid msg: ", msg);
        return;
      }

      handlers.forEach((handler) => {
        try {
          handler(msg)
        } catch (err) {
          console.error("single handler error: ", err);
        }
      });
    } catch (err) {
      console.error("Invlaid msg: ", event.data);
      return;
    }
  })
}

export function onMessage(handler: Handler) {
  handlers.add(handler);
  return () => {
    handlers.delete(handler)
  };
}
