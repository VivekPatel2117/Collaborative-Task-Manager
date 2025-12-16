import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  const token = req.cookies?.token as string | undefined;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = verifyToken(token);

    // attach user to request (typed via declaration merging)
    req.user = {
      id: payload.userId,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
