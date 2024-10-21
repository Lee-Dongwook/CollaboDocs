import express, { type Application } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import documentRoutes from "./routes/documentRoutes";
import { setupSocket } from "./socket/socketHandlers";

const app: Application = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());

connectDB();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("message", (msg) => {
    console.log("Message from client:", msg);
    io.emit("message", msg);
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);

setupSocket(io);

export default server;
