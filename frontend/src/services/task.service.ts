import { apiFetch } from "@/lib/api";
import type { Task, PaginatedTasksResponse } from "@/types/task";
import toast from "react-hot-toast";

/* ============================
   Error Handler
============================ */


type GetTasksParams = {
  page?: number;
  limit?: number;
};
const handleApiError = (error: any) => {
  const status = error?.status || error?.response?.status;

  switch (status) {
    case 401:
      toast.error("Please login again");
      break;
    case 403:
      toast.error("You are not allowed to perform this action");
      break;
    case 404:
      toast.error("Task not found");
      break;
    case 500:
      toast.error("Something went wrong. Try again later");
      break;
    default:
      toast.error(error?.message || "Unexpected error occurred");
  }
};

/* ============================
   Fetch paginated tasks
============================ */

export const getTasks = async ({
  page = 1,
  limit = 5,
}: GetTasksParams = {}): Promise<PaginatedTasksResponse<Task>> => {
  try {
    return await apiFetch<PaginatedTasksResponse<Task>>(
      `/api/tasks?page=${page}&limit=${limit}`
    );
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/* ============================
   Create task
============================ */

export const createTask = async (
  data: Partial<Task>
): Promise<Task> => {
  try {
    return await apiFetch<Task>("/api/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/* ============================
   Update task
============================ */

export const updateTask = async (
  id: string,
  data: Partial<Task>
): Promise<Task> => {
  try {
    return await apiFetch<Task>(`/api/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/* ============================
   Delete task
============================ */

export const deleteTask = async (id: string): Promise<void> => {
  try {
    await apiFetch<void>(`/api/tasks/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
