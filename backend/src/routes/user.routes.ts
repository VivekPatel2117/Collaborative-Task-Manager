import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";
import { authMiddleware as isAuthenticated } from "../middlewares/auth.middleware";
const router = Router();

/** PROTECT ALL USER ROUTES */
router.use(isAuthenticated);

router.post("/", createUser);      // Create user
router.get("/", getUsers);         // Get all users
router.get("/:id", getUserById);   // Get user by id
router.patch("/:id", updateUser);  // Update user
router.delete("/:id", deleteUser); // Delete user
export default router;
