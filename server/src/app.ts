import express, { type Application } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { ExpressPeerServer } from "peer";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import documentRoutes from "./routes/documentRoutes";
import { setupSocket } from "./socket/socketHandlers";

dotenv.config();

const app: Application = express();
const server = http.createServer(app);

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.static("public"));

connectDB();

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const peerServer = ExpressPeerServer(server, {
  allow_discovery: true,
});

app.use("/myapp", peerServer);
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);

// 기본 소켓 연결 설정 및 WebRTC Signaling 처리
io.on("connection", (socket: Socket) => {
  console.log("User connected:", socket.id);

  socket.on("login", (userId) => {
    console.log(`User ${userId} logged in`);
    socket.emit("message", "Hello! You are Logged In!");
  });

  socket.on("message", (msg) => {
    console.log("Message from client:", msg);
    io.emit("message", msg);
  });

  socket.on("offer", (offer, receiverId) => {
    console.log("Offer received: ", offer);
    io.to(receiverId).emit("offer", offer, socket.id);
  });

  socket.on("answer", (answer, senderId) => {
    console.log("Answer received: ", answer);
    io.to(senderId).emit("answer", answer);
  });

  socket.on("ice-candidate", (candidate, receiverId) => {
    console.log("ICE candidate received:", candidate);
    io.to(receiverId).emit("ice-candidate", candidate);
  });

  socket.on("update", (data) => {
    console.log("Update received: ", data);
    io.emit("update", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    io.emit("user-disconnected", socket.id);
  });
});

setupSocket(io);

export default server;
