import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { registerDto, loginDto } from "../dto/auth.dto";

export const authController = {
  async register(req: Request, res: Response) {
    const data = registerDto.parse(req.body);

    const { user, token } = await authService.register(data);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  },

  async login(req: Request, res: Response) {
    const data = loginDto.parse(req.body);

    const { user, token } = await authService.login(data);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  },

  async getMe(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await authService.getMe(userId);
    res.json(user);
  },

  logout(req: Request, res: Response) {
    // client deletes token
    res.json({ message: "Logged out" });
  },
};
