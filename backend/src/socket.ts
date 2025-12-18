import { Server } from "socket.io";

export let io: Server;

export const initSocket = (httpServer: any) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (userId: string) => {
      socket.join(`user:${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
