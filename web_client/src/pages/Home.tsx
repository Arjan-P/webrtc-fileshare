import { RoomForm } from "../components/RoomForm"
import { useSignaling } from "../context/SignalingContext"

export function Home() {
  const {id} = useSignaling();
  return (
    <section className="p-8">
      <h1>Client ID: {id}</h1>
      <h2> Home </h2>
      <div className="h-full w-full flex justify-around items-center">
      <div className="bg-gray-400 p-6 rounded-lg">
        <RoomForm />
      </div>
    </div>
    </section>
  )
}
