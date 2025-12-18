import { Router } from "express";
import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsAsRead
} from "../controllers/notification.controller";
import { authMiddleware as isAuthenticated } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", isAuthenticated, getMyNotifications);
router.patch("/:id/read", isAuthenticated, markNotificationRead);
router.patch("/read-all", isAuthenticated, markAllNotificationsAsRead);

export default router;
