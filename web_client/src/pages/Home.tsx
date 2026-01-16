import { RoomForm } from "../components/RoomForm"

export function Home() {

  return (
    <section className="p-8">
      <h1> Home </h1>
      <div className="h-full w-full flex justify-around items-center">
      <div className="bg-gray-400 p-6 rounded-lg">
        <RoomForm />
      </div>
    </div>
    </section>
  )
}
