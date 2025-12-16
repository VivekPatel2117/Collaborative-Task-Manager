import { Router } from "express";
import {
  getMyProfile,
  updateMyProfile,
} from "../controllers/profile.controller";
import { authMiddleware as isAuthenticated } from "../middlewares/auth.middleware";

const router = Router();

/** PROTECT ALL PROFILE ROUTES */
router.use(isAuthenticated);

router.get("/", getMyProfile);
router.patch("/", updateMyProfile);

export default router;
