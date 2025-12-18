import { useEffect, useState } from "react";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { socket } from "../socket";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/services/notification.service";

type Notification = {
  id?: string;
  message: string;
  createdAt?: string;
  isRead?: boolean;
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  /* ============================
     FETCH + SOCKET
  ============================ */
  useEffect(() => {
    getNotifications().then(setNotifications);

    socket.on("notification:new", (notification: Notification) => {
      setNotifications((prev) => [
        { ...notification, isRead: false },
        ...prev,
      ]);
    });

    return () => {
      socket.off("notification:new");
    };
  }, []);

  /* ============================
     MARK SINGLE READ
  ============================ */
  const handleMarkRead = async (id?: string) => {
    if (!id) return;

    // optimistic UI
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      )
    );

    try {
      await markNotificationRead(id);
    } catch (e) {
      console.error(e);
    }
  };

  /* ============================
     MARK ALL READ
  ============================ */
  const handleMarkAllRead = async () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true }))
    );

    try {
      await markAllNotificationsRead();
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = notifications.filter(
    (n) => !n.isRead
  ).length;

  return (
    <div className="relative">
      {/* 🔔 Bell Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((prev) => !prev)}
        className="relative"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
        )}
      </Button>

      {/* 🔽 Dropdown */}
      {open && (
        <Card className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto shadow-lg z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b">
            <span className="font-semibold">Notifications</span>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllRead}
              >
                Mark all read
              </Button>
            )}
          </div>

          {/* Body */}
          {notifications.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications.map((n, index) => (
              <div
                key={n.id ?? index}
                className={`flex items-start justify-between gap-2 p-3 border-b text-sm ${
                  !n.isRead ? "bg-muted/50" : ""
                }`}
              >
                <span>{n.message}</span>

                {!n.isRead && n.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleMarkRead(n.id)}
                  >
                    <Check size={16} />
                  </Button>
                )}
              </div>
            ))
          )}
        </Card>
      )}
    </div>
  );
}
