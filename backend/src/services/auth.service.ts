import { userRepository } from "../repositories/user.repository";
import { hashPassword, comparePassword } from "../utils/password";
import { signToken } from "../utils/jwt";
import { RegisterDto, LoginDto } from "../dto/auth.dto";

export const authService = {
  async register(data: RegisterDto) {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw new Error("User already exists");
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    const token = signToken({ userId: user.id });

    return { user, token };
  },

  async login(data: LoginDto) {
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const valid = await comparePassword(data.password, user.password);
    if (!valid) {
      throw new Error("Invalid credentials");
    }

    const token = signToken({ userId: user.id });

    return { user, token };
  },
};
