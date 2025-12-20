import { useEffect } from "react";
import { socket } from "../socket";
import { useTaskStore } from "@/store/task.store";
import { useNotificationStore } from "@/store/notification.store";
import { toast } from "react-hot-toast";
import type { Task } from "@/types/task";

export const useTaskSocket = (user: any) => {
  
  useEffect(() => {
    // If no user yet (still loading), don't do anything
    if (!user?.id) return;

    const { addTask, updateTask } = useTaskStore.getState();
    const { addNotification } = useNotificationStore.getState();

    const joinRoom = () => {
  if (user?.id) {
    // We add "user:" to match what the backend logs showed
    const roomName = `user:${user.id}`; 
    console.log(`🔑 Joining socket room: ${roomName}`);
    socket.emit("join", user.id); // Or socket.emit("join", roomName) depending on backend logic
  }
};

    const onConnect = () => {
      console.log("%c🔌 Socket Connected:", "color: #00ff00; font-weight: bold;", socket.id);
      joinRoom();
    };

    const handleTaskCreated = (task: Task) => {
      console.log("🆕 Event [task:created]:", task);
      addTask(task);
    };

    const handleTaskUpdated = (task: Task) => {
      console.log("🔄 Event [task:updated]:", task);
      updateTask(task);
    };

    const handleNotification = (n: any) => {
      console.log("🔔 Event [notification:new]:", n);
      addNotification({
        id: n.id || Math.random().toString(),
        message: n.message,
        isRead: false,
        createdAt: new Date().toISOString(),
        userId: n.userId || "",
        type: n.type || "info"
      });
      toast.success(n.message);
    };

    // Register listeners
    socket.on("connect", onConnect);
    socket.on("task:created", handleTaskCreated);
    socket.on("task:updated", handleTaskUpdated);
    socket.on("notification:new", handleNotification);

    // Initial join if already connected
    if (socket.connected) joinRoom();

    return () => {
      socket.off("connect", onConnect);
      socket.off("task:created", handleTaskCreated);
      socket.off("task:updated", handleTaskUpdated);
      socket.off("notification:new", handleNotification);
    };
  }, [user?.id]); // 👈 IMPORTANT: Re-runs when the user is finally loaded
};