import { prisma } from "../prisma/client";

interface UpdateProfileInput {
  name: string;
  email: string;
}

export class ProfileService {
  /** GET LOGGED-IN USER PROFILE */
  static async getMyProfile(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /** UPDATE LOGGED-IN USER PROFILE */
  static async updateMyProfile(
    userId: string,
    data: UpdateProfileInput
  ) {
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
}
