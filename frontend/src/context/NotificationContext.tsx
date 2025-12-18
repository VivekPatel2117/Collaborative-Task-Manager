import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getNotifications } from "@/services/notification.service";
import { socket } from "../socket";

export interface Notification {
  id?: string;
  taskId?: string;
  message: string;
  createdAt?: string;
  isRead?: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (n: Notification) => void;
  markAsRead: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Add notification
  const addNotification = (n: Notification) => {
    setNotifications((prev) => [n, ...prev]);
  };

  // Mark as read (optional)
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      )
    );
  };

  useEffect(() => {
    // 1️⃣ Load persisted notifications
    getNotifications().then(setNotifications);

    // 2️⃣ Listen for socket notifications
    socket.on("notification:new", (notification: Notification) => {
      addNotification(notification);
    });

    return () => {
      socket.off("notification:new");
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, markAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider"
    );
  }
  return ctx;
};
