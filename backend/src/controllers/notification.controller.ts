import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service";

export const getMyNotifications = async (req: Request, res: Response) => {
  const notifications = await NotificationService.getUserNotifications(
    req.user!.id
  );
  res.json(notifications);
};

export const markNotificationRead = async (req: Request, res: Response) => {
  await NotificationService.markAsRead(
    req.params.id,
    req.user!.id
  );

  res.json({ success: true });
};
export const markAllNotificationsAsRead = async (
  req: Request,
  res: Response
) => {
  await NotificationService.markAllAsRead(req.user!.id);
  res.json({ success: true });
};
