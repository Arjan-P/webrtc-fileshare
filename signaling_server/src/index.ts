import { createWSServer } from "./wsServer.js";
import { ENV } from "./config/env.js";

const PORT = ENV.PORT;
const wss = createWSServer(PORT);
console.log(`WS server listening on port ${PORT}`);
