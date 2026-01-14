import { useSignaling } from "./context/SignalingContext"
import React, { useEffect, useState } from "react";
import type { ClientId } from "./util/signaling";
import { handleAnswer, handleIce, handleOffer, makeOffer, sendFile } from "./util/webrtc";

function App() {
  const [peers, setPeers] = useState<ClientId[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const { id, sendMessage, onMessage } = useSignaling();
  useEffect(() => {
    return onMessage(async msg => {
      switch (msg.type) {
        case "offer":
          const answer = await handleOffer(msg.to, msg.from, msg.offer);
          sendMessage({
            type:"answer",
            from: msg.to,
            to: msg.from,
            answer
          })
          break;
        case "answer":
          await handleAnswer(msg.to, msg.from, msg.answer);
          break;
        case "new-ice-candidates":
          await handleIce(msg.to, msg.from, msg.ice)
          break;
        case "new-connection":
          setPeers(msg.peers);
          break;
        case "peer-join":
          setPeers(prev => [...prev, msg.id]);
          break;
        case "peer-left":
          setPeers(prev => prev.filter(prev => prev !== msg.id));
          break;
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    for (const peer of peers) {
      const offer = await makeOffer(id, peer);
      if (offer) {
        sendMessage({ type: "offer", from: id, to: peer, offer });
      }
      if(file) sendFile(id, peer, file);
    }
  }

  return (
    <>
      <h1>Client ID: {id}</h1>
      <ul>
        {peers.map(peer => (
          <li key={peer}>{peer}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <br />
        <button type="submit">Share</button>
      </form>
    </>
  )
}

export default App
