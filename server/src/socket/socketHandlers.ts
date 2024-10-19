import { Server, Socket } from "socket.io";

export const setupSocket = (io: Server) => {
  const usersInDocument: Record<string, Set<string>> = {};

  io.on("connection", (socket: Socket) => {
    socket.on("join-document", (documentId: string) => {
      if (!usersInDocument[documentId]) {
        usersInDocument[documentId] = new Set();
      }

      usersInDocument[documentId].add(socket.id);

      io.to(documentId).emit(
        "update-participants",
        Array.from(usersInDocument[documentId])
      );

      socket.join(documentId);
    });

    socket.on("edit-document", (documentId: string, content: string) => {
      socket.to(documentId).emit("receive-edit", content);
    });

    socket.on("send-message", (documentId: string, message: string) => {
      io.to(documentId).emit("receive-message", message);
    });

    socket.on("disconnect", () => {
      Object.keys(usersInDocument).forEach((documentId) => {
        usersInDocument[documentId].delete(socket.id);
        io.to(documentId).emit(
          "update-participants",
          Array.from(usersInDocument[documentId])
        );
      });

      console.log("Client disconnected", socket.id);
    });
  });
};
