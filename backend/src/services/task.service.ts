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
    console.log(`[TaskService] Creating task: "${data.title}" for user: ${data.assignedToId}`);

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

    console.log(`[Socket] Broadcasting task:created - ID: ${task.id}`);
    io.emit("task:created", task);

    try {
      await NotificationService.create({
        userId: data.assignedToId,
        taskId: task.id,
        type: "TASK_ASSIGNED",
        message: `You were assigned task "${task.title}"`,
      });
      console.log(`[Notification] Created assignment notification for user: ${data.assignedToId}`);
    } catch (err) {
      console.error("[Notification] Failed to create assignment notification:", err);
    }

    return task;
  }

  /* ============================
      GET TASK BY ID
  ============================ */
  static async getById(taskId: string) {
    console.log(`[TaskService] Fetching task details for ID: ${taskId}`);
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
    console.log(`[TaskService] Fetching all tasks with filters:`, params);
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
  console.log(`[TaskService] Updating task: ${taskId} by user: ${userId}`);

  // 1. Fetch existing task
  const existingTask = await prisma.task.findFirst({
    where: { id: taskId, creatorId: userId },
  });

  if (!existingTask) {
    console.warn(`[TaskService] Unauthorized update attempt for task ${taskId}`);
    throw new Error("UNAUTHORIZED_OR_TASK_NOT_FOUND");
  }

  // 2. Perform the update
  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data,
  });

  // 3. Broadcast for UI sync
  io.emit("task:updated", updatedTask);

  // 4. Determine exactly what changed for specific messaging
  const changes: string[] = [];
  if (data.status && data.status !== existingTask.status) changes.push("Status");
  if (data.priority && data.priority !== existingTask.priority) changes.push("Priority");
  if (data.title && data.title !== existingTask.title) changes.push("Title");
  if (data.description && data.description !== existingTask.description) changes.push("Description");

  const oldAssigneeId = existingTask.assignedToId;
  const newAssigneeId = data.assignedToId;
  const isReassigned = newAssigneeId && newAssigneeId !== oldAssigneeId;

  if (isReassigned) {
    // SCENARIO A: Reassignment notifications
    const newNotif = await NotificationService.create({
      userId: newAssigneeId as string,
      taskId: updatedTask.id,
      type: "TASK_ASSIGNED",
      message: `You have been assigned to the task: "${updatedTask.title}"`,
    });
    io.to(newAssigneeId).emit("notification:new", newNotif);

    if (oldAssigneeId) {
      const oldNotif = await NotificationService.create({
        userId: oldAssigneeId,
        taskId: updatedTask.id,
        type: "TASK_UNASSIGNED",
        message: `You have been unassigned from the task: "${updatedTask.title}"`,
      });
      io.to(oldAssigneeId).emit("notification:new", oldNotif);
    }
  } else if (oldAssigneeId && changes.length > 0) {
    // SCENARIO B: Specific updates to Status, Priority, etc.
    // Generates message like: "Task Status and Priority has updated for: Buy Milk"
    const changeText = changes.join(" and ");
    const specificMessage = `Task ${changeText} has updated for: "${updatedTask.title}"`;

    const updateNotif = await NotificationService.create({
      userId: oldAssigneeId,
      taskId: updatedTask.id,
      type: "TASK_UPDATED",
      message: specificMessage,
    });
    
    // Emit specifically to the assignee
    io.to(oldAssigneeId).emit("notification:new", updateNotif);
    console.log(`[Notification] Sent specific update alert to: ${oldAssigneeId}`);
  }

  return updatedTask;
}

  /* ============================
      DELETE TASK (CREATOR ONLY)
  ============================ */
  static async delete(taskId: string, userId: string) {
    console.log(`[TaskService] Deleting task: ${taskId} by user: ${userId}`);

    const task = await prisma.task.findFirst({
      where: { id: taskId, creatorId: userId },
      select: { id: true, title: true, assignedToId: true },
    });

    if (!task) {
      console.warn(`[TaskService] Unauthorized delete attempt for task ${taskId} by user ${userId}`);
      throw new Error("UNAUTHORIZED_OR_TASK_NOT_FOUND");
    }

    // 1️⃣ Create notification
    await NotificationService.create({
      userId: task.assignedToId,
      type: "TASK_UPDATED",
      message: `Task "${task.title}" assigned to you was deleted`,
    });

    // 2️⃣ Delete task
    await prisma.task.delete({
      where: { id: taskId },
    });

    // 3️⃣ Socket update (Fixed: Sending ID string directly)
    console.log(`[Socket] Broadcasting task:deleted - ID: ${taskId}`);
    io.emit("task:deleted", taskId);

    return { success: true };
  }
}