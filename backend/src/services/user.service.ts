import { prisma } from "../prisma/client";

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
}

export class UserService {
  /** CREATE USER */
  static async create(data: CreateUserInput) {
    return prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
  }

  /** GET ALL USERS */
  static async getAll() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /** GET USER BY ID */
  static async getById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
  }

  /** UPDATE USER */
  static async update(userId: string, data: UpdateUserInput) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        updatedAt: true,
      },
    });
  }

  /** DELETE USER */
  static async delete(userId: string) {
    return prisma.user.delete({
      where: { id: userId },
      select: {
        id: true,
        email: true,
      },
    });
  }
}
