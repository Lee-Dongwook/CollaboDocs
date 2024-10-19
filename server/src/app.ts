import express, { type Application } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import connectDB from "./config/db";
import documentRoutes from "./routes/documentRoutes";
import { setupSocket } from "./socket/socketHandlers";

const app: Application = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/documents", documentRoutes);

setupSocket(io);

export default server;
