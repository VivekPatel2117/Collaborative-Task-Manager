import { apiFetch } from "@/lib/api";

/* ============================
   Types
============================ */

export type NotificationType =
  | "TASK_ASSIGNED"
  | "TASK_UPDATED"
  | "TASK_STATUS_CHANGED"
  | "TASK_PRIORITY_CHANGED"
  | "TASK_DELETED";

export interface Notification {
  id: string;
  userId: string;
  taskId?: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
}

/* ============================
   API Services
============================ */

/**
 * Get all notifications for logged-in user
 */
export const getNotifications = (): Promise<Notification[]> => {
  return apiFetch<Notification[]>("/api/notifications");
};

/**
 * Get unread notification count
 */
export const getUnreadNotificationCount = (): Promise<{ count: number }> => {
  return apiFetch<{ count: number }>("/api/notifications/unread-count");
};

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = (
  notificationId: string
): Promise<Notification> => {
  return apiFetch<Notification>(`/api/notifications/${notificationId}/read`, {
    method: "PATCH",
  });
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = (): Promise<{ success: boolean }> => {
  return apiFetch<{ success: boolean }>("/api/notifications/read-all", {
    method: "PATCH",
  });
};

export const markNotificationRead = (id: string) => {
  return apiFetch(`/api/notifications/${id}/read`, {
    method: "PATCH",
  });
};
/**
 * Delete a notification (optional)
 */

export const markAllNotificationsRead = () => {
  return apiFetch("/api/notifications/read-all", {
    method: "PATCH",
  });
};


export const deleteNotification = (
  notificationId: string
): Promise<{ success: boolean }> => {
  return apiFetch<{ success: boolean }>(
    `/api/notifications/${notificationId}`,
    {
      method: "DELETE",
    }
  );





};
