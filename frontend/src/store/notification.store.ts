import { create } from "zustand";
import type { Notification } from "@/services/notification.service";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Notification) => void;
  setNotifications: (n: Notification[]) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (n) =>
    set((state) => ({
      notifications: [n, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),

  setNotifications: (n) =>
    set({
      notifications: n,
      unreadCount: n.filter((x) => !x.isRead).length,
    }),
}));
