import { WebSocketServer, WebSocket } from "ws";
import type { ClientId, SignalMsg } from "./msgTypes.js";
import { nanoid } from "nanoid";

const room = new Map<ClientId, WebSocket>();

export function createWSServer(port: number): WebSocketServer {
  const wss = new WebSocketServer({ port });
  wss.on('connection', (ws: WebSocket) => {  // fired when client successfully upgrades from http to ws
    // assign id
    const id = nanoid();
    ws.send(JSON.stringify({type:"new-connection", id, peers: [...room.keys()]}));
    room.set(id, ws);
    room.forEach(peer => {
      if(peer !== ws) peer.send(JSON.stringify({type:"peer-join", id}));
    })
    console.log(`${id} joined room`);
    console.log([...room.keys()]);
    ws.on('error', console.error);
    ws.on('message', (data: WebSocket.RawData) => {
      const msgStr = data.toString();
      const msg: SignalMsg = JSON.parse(msgStr);
      console.log(`${id}|msg|-> ${msgStr}`);
      switch(msg.type) {
        case "answer":
        case "offer":
        case "new-ice-candidates":
          const peer = room.get(msg.to)
          if(peer?.readyState === WebSocket.OPEN) peer?.send(msgStr);
          break;
      }
    });
    ws.on('close', () => {
      console.log(`${id} left room`);
      room.delete(id);
      room.forEach(peer => {
        peer.send(JSON.stringify({
          type: "peer-left",
          id
        }));
      })
    });
  })
  return wss;
}
