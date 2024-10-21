import { io, Socket } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const socket: Socket = io(URL, {
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("Connected to the server");
});

socket.on("message", (msg) => {
  console.log("Message from server: ", msg);
});

socket.emit("message", "Hello Server!");

export default socket;
