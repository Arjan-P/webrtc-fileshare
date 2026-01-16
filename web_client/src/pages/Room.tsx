import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { ClientId } from "../util/signaling";
import { useSignaling } from "../context/SignalingContext";
import { handleAnswer, handleIce, handleOffer, makeOffer, sendFile } from "../util/webrtc";

export function Room() {
  const { roomId } = useParams();
  const { id, webSocketOpen, sendMessage, onMessage } = useSignaling();
  const [peers, setPeers] = useState<ClientId[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      console.log("No file provided");
      return;
    }

    for (const peer of peers) {
      const offer = await makeOffer(id, peer);
      if (offer) {

        sendMessage({
          type: "offer",
          from: id,
          target: peer,
          sdp: offer
        });
      }
      sendFile(id, peer, file);
    }
  }

  useEffect(() => {
    if (!roomId || !webSocketOpen) return;
    const leaveRoom = () => {
      sendMessage({
        type: "leave",
        roomId,
        clientId: id
      })
    }
    const unsubscribe = onMessage(async msg => {
      switch (msg.type) {
        case "offer":
          const answer = await handleOffer(id, msg.from, msg.sdp);
          sendMessage({
            type: "answer",
            from: id,
            target: msg.from,
            sdp: answer
          });
          break;
        case "answer":
          await handleAnswer(id, msg.from, msg.sdp);
          break;
        case "ice":
          await handleIce(id, msg.from, msg.candidate);
          break;
        case "room-peers":
          setPeers(msg.peers);
          break;
        case "peer-join":
          setPeers(prev =>
            prev.includes(msg.clientId) ? prev : [...prev, msg.clientId]
          );
          break;
        case "peer-left":
          setPeers(prev => prev.filter(peer => peer !== msg.clientId));
          break;
      }
    });

    sendMessage({
      type: "join",
      roomId,
      clientId: id
    });

    return () => {
      leaveRoom();
      unsubscribe();
    }
  }, [roomId, webSocketOpen]);

  return (
    <div>
      <h1> Room: {roomId}</h1>
      <ul>
        {peers.map(peer => (
          <li key={peer}>{peer}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={(e) => { setFile(e.target.files?.[0] ?? null) }} />
        <br />
        <button type="submit">Share</button>
      </form>
    </div>
  )
}
