import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import userRoutes from "./routes/user.routes";
import profileRoutes from "./routes/profile.routes";
import notificationRoutes from "./routes/notification.routes";
const app = express();
import http from "http";
import { initSocket } from "./socket";
const server = http.createServer(app);
initSocket(server);

server.listen(4000);

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


app.use("/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

app.use("/api/profile", profileRoutes);

export default app;
