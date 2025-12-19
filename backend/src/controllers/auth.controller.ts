import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { registerDto, loginDto } from "../dto/auth.dto";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" as const : "lax" as const,
};

export const authController = {
  async register(req: Request, res: Response) {
    const data = registerDto.parse(req.body);

    const { user, token } = await authService.register(data);

    res.cookie("token", token, COOKIE_OPTIONS);

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  },

  async login(req: Request, res: Response) {
    const data = loginDto.parse(req.body);

    const { user, token } = await authService.login(data);

    res.cookie("token", token, COOKIE_OPTIONS);

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  },
  async  getMe(req: Request, res: Response) {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await authService.getMe(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
},
  logout(req: Request, res: Response) {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
  },
};
