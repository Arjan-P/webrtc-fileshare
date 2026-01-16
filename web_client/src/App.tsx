import { Outlet } from "react-router-dom";
import { useSignaling } from "./context/SignalingContext";

function App() {
  const { id } = useSignaling();
  return (
    <>
      <div className="h-[100dvh] flex flex-col items-center bg-gray-800 overflow-y-auto">

        <h1>Client ID: {id}</h1>
        <main className="h-full w-full p-4">
          <div className='w-full h-full px-4 rounded-xl shadow-xl bg-gray-600'>
            <Outlet />
          </div>
        </main>
      </div>
    </>
  )
}

export default App
