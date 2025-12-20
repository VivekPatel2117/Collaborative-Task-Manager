import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import userRoutes from "./routes/user.routes";
import profileRoutes from "./routes/profile.routes";
import notificationRoutes from "./routes/notification.routes";
import http from "http";
import { initSocket } from "./socket";

const app = express();
const server = http.createServer(app);

app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.CLIENT_URL, // https://collaborative-task-manager-vert.vercel.app
    credentials: false, // ❌ cookies not needed anymore
  })
);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);

initSocket(server);

server.listen(4000);

export default app;
