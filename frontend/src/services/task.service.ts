import { apiFetch } from "@/lib/api";
import type { Task } from "@/types/task";

export const getTasks = () =>
  apiFetch<Task[]>("/api/tasks");

export const createTask = (data: Partial<Task>) =>
  apiFetch<Task>("/api/tasks", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateTask = (id: string, data: Partial<Task>) =>
  apiFetch<Task>(`/api/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteTask = (id: string) =>
  apiFetch<void>(`/api/tasks/${id}`, {
    method: "DELETE",
  });
