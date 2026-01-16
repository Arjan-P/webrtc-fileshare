import { CreateRoom } from "../components/CreateRoom"
import { JoinRoom } from "../components/JoinRoom"
export function Home() {
  return (
    <div>
      <h1> Home </h1>
      <CreateRoom />
      <JoinRoom />
    </div>
  )
}
