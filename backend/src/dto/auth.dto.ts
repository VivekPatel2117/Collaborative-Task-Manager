import { z } from "zod";

export const registerDto = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginDto = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type RegisterDto = z.infer<typeof registerDto>;
export type LoginDto = z.infer<typeof loginDto>;
