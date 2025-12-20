import { useEffect } from "react";
import { socket } from "../socket";
import { useTaskStore } from "@/store/task.store";
import { useNotificationStore } from "@/store/notification.store"; // Import this too
import { toast } from "react-hot-toast";
import type { Task } from "@/types/task";

export const useTaskSocket = () => {
  useEffect(() => {
    const { addTask, updateTask, removeTask } = useTaskStore.getState();
    const { addNotification } = useNotificationStore.getState();

    // 🌐 Connection Monitoring
    socket.on("connect", () => {
      console.log("%c🔌 Socket Connected:", "color: #00ff00; font-weight: bold;", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("%c❌ Socket Disconnected:", "color: #ff0000; font-weight: bold;", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("⚠️ Socket Connection Error:", error.message);
    });

    // ✅ Task Created Handler
    const handleTaskCreated = (task: Task) => {
      console.log("🆕 Event [task:created]:", task);
      addTask(task);
      // toast.success(`New task created: ${task.title}`);
    };

    // ✅ Task Updated Handler
    const handleTaskUpdated = (task: Task) => {
      console.log("🔄 Event [task:updated]:", task);
      updateTask(task);
      // toast.success(`Task updated: ${task.title}`);
    };

    // ✅ Task Deleted Handler
    const handleTaskDeleted = (taskId: string) => {
      console.log("🗑️ Event [task:deleted]. ID:", taskId);
      removeTask(taskId);
    };

    // ✅ Notification Handler
    const handleNotification = (n: any) => {
      console.log("🔔 Event [notification:new]:", n);
      // Sync with your notification store
      addNotification({
        id: n.id || Math.random().toString(),
        message: n.message,
        isRead: false,
        createdAt: new Date().toISOString(),
        userId: n.userId || "",
        type: n.type || "info"
      });
      toast.success(n.message+" (New Notification)");
    };

    // ✅ Register listeners
    socket.on("task:created", handleTaskCreated);
    socket.on("task:updated", handleTaskUpdated);
    socket.on("task:deleted", handleTaskDeleted);
    socket.on("notification:new", handleNotification);

    // ✅ Cleanup
    return () => {
      console.log("🧹 Cleaning up socket listeners...");
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("task:created", handleTaskCreated);
      socket.off("task:updated", handleTaskUpdated);
      socket.off("task:deleted", handleTaskDeleted);
      socket.off("notification:new", handleNotification);
    };
  }, []);
};