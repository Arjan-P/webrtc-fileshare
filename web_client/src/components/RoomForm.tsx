import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { RoomId } from "../util/signaling";

export function RoomForm() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState<RoomId | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createRoom = async () => {

    try {

      const res = await fetch(`${import.meta.env.VITE_HTTP_SERVER_URL}/room`, { method: 'POST' });

      if (!res.ok) throw new Error("Failed to create room");

      const { roomId } = await res.json();
      navigate(`/room/${roomId}`);
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    }
  };

  const joinRoom = async () => {
    try {

      if (!roomId) {
        setError("Room ID not entered");
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_HTTP_SERVER_URL}/room/${roomId}`
      );

      if (!res.ok) {
        setError("Room not found");
        return;
      }
      navigate(`/room/${roomId}`);
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    }

  }

  return (
    <div className="grid grid-rows-2 divide-y items-center gap-3">

      <div className="flex flex-col">
        <input type="text" onChange={(e) => { setRoomId(e.target.value) }} className="border"/>
        <button type="button" onClick={joinRoom} className="font-bold">
          Join
        </button>
      </div>

      <button type="button" onClick={createRoom} className="font-bold">
        Create
      </button>

      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
