import { useEffect, useState } from "react";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { socket } from "../../socket";
import { useNotificationStore } from "@/store/notification.store"; // Import your store
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/services/notification.service";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  
  // 1. Pull everything from the store
  const { 
    notifications, 
    unreadCount, 
    addNotification, 
    setNotifications 
  } = useNotificationStore();

  /* ============================
      FETCH + SOCKET
  ============================ */
  useEffect(() => {
    // Initial fetch from API
    getNotifications().then((data) => {
      setNotifications(data);
    });

    // Listen for real-time notifications
    const handleNewNotification = (n: any) => {
      // Ensure it has the structure the store expects
      addNotification({ ...n, isRead: false });
    };

    socket.on("notification:new", handleNewNotification);

    return () => {
      socket.off("notification:new", handleNewNotification);
    };
  }, [setNotifications, addNotification]);

  /* ============================
      MARK SINGLE READ
  ============================ */
  const handleMarkRead = async (id?: string) => {
    if (!id) return;

    // 2. Optimistic UI update in the store
    const updatedList = notifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    );
    setNotifications(updatedList);

    try {
      await markNotificationRead(id);
    } catch (e) {
      console.error("Failed to mark read:", e);
      // Optional: Re-fetch or revert on error
    }
  };

  /* ============================
      MARK ALL READ
  ============================ */
  const handleMarkAllRead = async () => {
    // 3. Update store immediately
    const updatedList = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updatedList);

    try {
      await markAllNotificationsRead();
    } catch (e) {
      console.error("Failed to mark all read:", e);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((prev) => !prev)}
        className="relative"
      >
        <Bell size={18} />
        {/* Use unreadCount directly from store */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <Card className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto shadow-lg z-50">
          <div className="flex items-center justify-between p-3 border-b sticky top-0 bg-background z-10">
            <span className="font-semibold">Notifications</span>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-8"
                onClick={handleMarkAllRead}
              >
                Mark all read
              </Button>
            )}
          </div>

          <div className="flex flex-col">
            {notifications.length === 0 ? (
              <div className="p-4 text-sm text-center text-muted-foreground">
                No notifications
              </div>
            ) : (
              notifications.map((n, index) => (
                <div
                  key={n.id ?? index}
                  className={`flex items-start justify-between gap-2 p-3 border-b text-sm transition-colors ${
                    !n.isRead ? "bg-muted/50 font-medium" : "text-muted-foreground"
                  }`}
                >
                  <span className="flex-1">{n.message}</span>

                  {!n.isRead && n.id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={() => handleMarkRead(n.id)}
                    >
                      <Check size={14} />
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  );
}