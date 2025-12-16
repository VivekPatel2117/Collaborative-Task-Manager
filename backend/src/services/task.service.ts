import { Prisma } from "@prisma/client";
import { prisma } from "../prisma/client";
import { Priority, Status } from "@prisma/client";

interface CreateTaskInput {
  title: string;
  description: string;
  dueDate: Date;
  priority: Priority;
  status?: Status;
  creatorId: string;
  assignedToId: string;
}

interface UpdateTaskInput {
  title?: string;
  description?: string;
  dueDate?: Date;
  priority?: Priority;
  status?: Status;
  assignedToId?: string;
}

export class TaskService {
  /**
   * CREATE TASK
   */
  static async create(data: CreateTaskInput) {
    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        priority: data.priority,
        status: data.status ?? Status.TODO,
        creatorId: data.creatorId,
        assignedToId: data.assignedToId,
      },
    });
  }

  /**
   * GET TASK BY ID
   */
  static async getById(taskId: string) {
    return prisma.task.findUnique({
      where: { id: taskId },
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        assignee: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  /**
   * GET ALL TASKS (with filters & sorting)
   */
  static async getAll(params: {
    assignedToId?: string;
    creatorId?: string;
    status?: Status;
    priority?: Priority;
    overdue?: boolean;
    sortByDueDate?: "asc" | "desc";
  }) {
    const where: Prisma.TaskWhereInput = {
      assignedToId: params.assignedToId,
      creatorId: params.creatorId,
      status: params.status,
      priority: params.priority,
    };

    if (params.overdue) {
      where.dueDate = { lt: new Date() };
      where.status = { not: Status.COMPLETED };
    }

    return prisma.task.findMany({
      where,
      orderBy: {
        dueDate: params.sortByDueDate ?? "asc",
      },
      include: {
        creator: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } },
      },
    });
  }

  /**
   * UPDATE TASK
   */
  static async update(taskId: string, data: UpdateTaskInput) {
    return prisma.task.update({
      where: { id: taskId },
      data,
    });
  }

  /**
   * DELETE TASK
   */
  static async delete(taskId: string) {
    return prisma.task.delete({
      where: { id: taskId },
    });
  }
}
