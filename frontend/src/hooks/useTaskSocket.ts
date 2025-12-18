import { useEffect } from "react";
import { socket } from "../socket";
import { useTaskStore } from "@/store/task.store";
import { toast } from "react-hot-toast";
import type { Task } from "@/types/task";

export const useTaskSocket = () => {
  useEffect(() => {
    const { addTask, updateTask, removeTask } =
      useTaskStore.getState();

    // ✅ Named handlers (IMPORTANT)
    const handleTaskCreated = (task: Task) => {
      addTask(task);
    };

    const handleTaskUpdated = (task: Task) => {
      updateTask(task);
      toast.success(`Task updated: ${task.title}`);
    };

    const handleTaskDeleted = (taskId: string) => {
      removeTask(taskId);
    };

const handleNotification = (n: {
  type: string;
  message: string;
  task?: Task;
}) => {
  toast.success(n.message);
};


    // ✅ Register listeners
    socket.on("task:created", handleTaskCreated);
    socket.on("task:updated", handleTaskUpdated);
    socket.on("task:deleted", handleTaskDeleted);
    socket.on("notification:new", handleNotification);

    // ✅ Cleanup (same references)
    return () => {
      socket.off("task:created", handleTaskCreated);
      socket.off("task:updated", handleTaskUpdated);
      socket.off("task:deleted", handleTaskDeleted);
      socket.off("notification:new", handleNotification);
    };
  }, []);
};
