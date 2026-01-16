import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ClientId } from "../util/signaling";
import { useSignaling } from "../context/SignalingContext";
import { handleAnswer, handleIce, handleOffer, makeOffer, sendFile } from "../util/webrtc";

export function Room() {
  const { roomId } = useParams();
  const { id, webSocketOpen, sendMessage, onMessage } = useSignaling();
  const [peers, setPeers] = useState<ClientId[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

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
    <section className="p-8">
      <h1>Client ID: {id}</h1>
      <h2> Room: {roomId}</h2>
      <ul>
        {peers.map(peer => (
          <li key={peer}>{peer}</li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <div className="space-y-12">
          <div className="border-b border-white/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <label className="block text-sm/6 font-medium text-white">Upload files</label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10">
                  <div className="text-center">
                    <div className="mt-4 flex text-sm/6 text-gray-400">
                      <label className="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-400 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-500 hover:text-indigo-300">
                        <span>Upload a file</span>
                        <input type="file" className="sr-only" onChange={(e) => { setFile(e.target.files?.[0] ?? null) }} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="button" onClick={() => navigate("/")}className="text-sm/6 font-semibold text-white">Leave Room</button>
          <button type="submit" className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Share</button>
        </div>
      </form>
    </section>
  )
}
