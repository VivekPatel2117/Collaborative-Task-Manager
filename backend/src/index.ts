import http from "http";
import { Server } from "socket.io";
import app from "./app";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
 socket.on("join", (userId: string) => {
    socket.join(`user:${userId}`);
    console.log(`👤 User ${userId} joined room user:${userId}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
