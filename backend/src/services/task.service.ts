import { Prisma, Priority, Status } from "@prisma/client";
import { prisma } from "../prisma/client";
import { io } from "../socket";
import { NotificationService } from "./notification.service";
/* ============================
   Interfaces
============================ */

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

/* ============================
   Task Service
============================ */

export class TaskService {
  /* ============================
     CREATE TASK
  ============================ */
 static async create(data: CreateTaskInput) {
  const task = await prisma.task.create({
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

  io.emit("task:created", task);

  await NotificationService.create({
    userId: data.assignedToId,
    taskId: task.id,
    type: "TASK_ASSIGNED",
    message: `You were assigned task "${task.title}"`,
  });

  return task;
}

  /* ============================
     GET TASK BY ID
  ============================ */
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

  static async count(params: {
  assignedToId?: string;
  creatorId?: string;
  status?: Status;
  priority?: Priority;
}) {
  return prisma.task.count({
    where: {
      assignedToId: params.assignedToId,
      creatorId: params.creatorId,
      status: params.status,
      priority: params.priority,
    },
  });
}


  /* ============================
     GET ALL TASKS (Filters)
  ============================ */
 static async getAll(params: {
  assignedToId?: string;
  creatorId?: string;
  status?: Status;
  priority?: Priority;
  skip?: number;
  take?: number;
}) {
  return prisma.task.findMany({
    where: {
      assignedToId: params.assignedToId,
      creatorId: params.creatorId,
      status: params.status,
      priority: params.priority,
    },
    skip: params.skip,
    take: params.take,
    orderBy: { createdAt: "desc" },
  });
}


  /* ============================
     UPDATE TASK (CREATOR ONLY)
  ============================ */
  static async update(taskId: string, userId: string, data: UpdateTaskInput) {
  const existingTask = await prisma.task.findFirst({
    where: { id: taskId, creatorId: userId },
  });

  if (!existingTask) {
    throw new Error("UNAUTHORIZED_OR_TASK_NOT_FOUND");
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data,
  });

  io.emit("task:updated", updatedTask);

  if (
    data.assignedToId &&
    data.assignedToId !== existingTask.assignedToId
  ) {
    await NotificationService.create({
      userId: data.assignedToId,
      taskId: updatedTask.id,
      type: "TASK_ASSIGNED",
      message: `You were assigned task "${updatedTask.title}"`,
    });
  }

  return updatedTask;
}


  /* ============================
     DELETE TASK (CREATOR ONLY)
  ============================ */
 static async delete(taskId: string, userId: string) {
  const task = await prisma.task.findFirst({
    where: { id: taskId, creatorId: userId },
    select: { id: true, title: true, assignedToId: true },
  });

  if (!task) {
    throw new Error("UNAUTHORIZED_OR_TASK_NOT_FOUND");
  }

  // 1️⃣ Create notification WITHOUT taskId
  await NotificationService.create({
    userId: task.assignedToId,
    type: "TASK_UPDATED",
    message: `Task "${task.title}" assigned to you was deleted`,
  });

  // 2️⃣ Now delete task
  await prisma.task.delete({
    where: { id: taskId },
  });

  // 3️⃣ Socket update
  io.emit("task:deleted", { taskId });

  return { success: true };
}



}
