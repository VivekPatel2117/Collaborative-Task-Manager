import { Router } from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/task.controller";
import { authMiddleware as isAuthenticated } from "../middlewares/auth.middleware";
const router = Router();
router.use(isAuthenticated);

router.post("/", createTask);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
