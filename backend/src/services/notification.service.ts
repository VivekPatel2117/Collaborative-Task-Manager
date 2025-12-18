import { prisma } from "../prisma/client";
import { io } from "../socket";
import { NotificationType } from "@prisma/client";

interface CreateNotificationInput {
  userId: string;
  taskId?: string;
  type: NotificationType;
  message: string;
}

export class NotificationService {
  static async create(data: CreateNotificationInput) {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        taskId: data.taskId,
        type: data.type,
        message: data.message,
      },
    });

    // Real-time push
    io.to(`user:${data.userId}`).emit("notification:new", notification);

    return notification;
  }

  static async markAsRead(notificationId: string, userId: string) {
    return prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,
      },
      data: { isRead: true },
    });
  }

   static async markAllAsRead(userId: string) {
    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return { success: true };
  }


  static async getUserNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }
}
