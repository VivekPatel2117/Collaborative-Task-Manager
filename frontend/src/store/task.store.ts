import { create } from "zustand";
import type { Task } from "@/types/task";
type TaskStore = {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  removeTask: (id: string) => void;
};

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) =>
    set((state) => ({ tasks: [task, ...state.tasks] })),
  updateTask: (task) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === task.id ? task : t
      ),
    })),
  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),
}));
