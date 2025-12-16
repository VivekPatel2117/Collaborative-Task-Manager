import { Request, Response } from "express";
import { ProfileService } from "../services/profile.service";

/** GET /api/profile */
export const getMyProfile = async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const profile = await ProfileService.getMyProfile(userId);

  if (!profile) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(profile);
};

/** PATCH /api/profile */
export const updateMyProfile = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { name, email } = req.body;

  const updatedProfile = await ProfileService.updateMyProfile(userId, {
    name,
    email,
  });

  res.json(updatedProfile);
};
