import { Server, Socket } from "socket.io";

export const setupSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("New client connected", socket.id);

    socket.on("join-document", (documentId: string) => {
      socket.join(documentId);
      console.log(`Socket ${socket.id} joined document ${documentId}`);
    });

    socket.on("edit-document", (documentId: string, content: string) => {
      socket.to(documentId).emit("receive-edit", content);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
    });
  });
};
