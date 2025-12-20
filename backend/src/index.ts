import http from "http";
import { Server } from "socket.io";
import app from "./app";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    // 🛑 WARNING: Do not use "*" in production with credentials
    // Replace this with your ACTUAL Vercel URL
    origin: ["https://collaborative-task-manager-vert.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true
  }
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
