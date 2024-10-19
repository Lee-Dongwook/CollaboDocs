import { io, Socket } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const socket: Socket = io(URL, {
  autoConnect: false,
});

export default socket;
