import { useSignaling } from "./context/SignalingContext"
import { Outlet } from "react-router-dom";

function App() {
  const { id } = useSignaling();

  return (
    <>
      <h1>Client ID: {id}</h1>
      <Outlet />
    </>
  )
}

export default App
