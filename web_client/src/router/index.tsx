import {createBrowserRouter} from "react-router-dom"
import App from '../App'
import { Home } from "../pages/Home"; 
import { Room } from "../pages/Room";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Home /> },
      { path: "room/:roomId", element: <Room />}
      ,
    ],
  },
]);
