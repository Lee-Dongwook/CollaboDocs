import express, { type Application } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import documentRoutes from "./routes/documentRoutes";
import { setupSocket } from "./socket/socketHandlers";

const app: Application = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

connectDB();

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// 기본 소켓 연결 설정
io.on("connection", (socket: Socket) => {
  console.log("User connected:", socket.id);

  socket.on("message", (msg) => {
    console.log("Message from client:", msg);
    io.emit("message", msg);
  });

  socket.on("update", (data) => {
    console.log("Update received: ", data);
    io.emit("update", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);

setupSocket(io);

export default server;
