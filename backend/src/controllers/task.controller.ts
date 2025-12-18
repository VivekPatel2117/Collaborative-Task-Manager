import { Request, Response } from "express";
import { TaskService } from "../services/task.service";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../dto/task.dto";

export const createTask = async (req: Request, res: Response) => {
  const payload = createTaskSchema.parse(req.body);

  const task = await TaskService.create({
    ...payload,
    creatorId: req.user!.id,
    dueDate: new Date(payload.dueDate),
  });

  res.status(201).json(task);
};

export const getTasks = async (req: Request, res: Response) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 5, 50); // cap limit
  const skip = (page - 1) * limit;

  const [tasks, total] = await Promise.all([
    TaskService.getAll({
      assignedToId: req.query.assignedToId as string,
      status: req.query.status as any,
      priority: req.query.priority as any,
      skip,
      take: limit,
    }),
    TaskService.count({
      assignedToId: req.query.assignedToId as string,
      status: req.query.status as any,
      priority: req.query.priority as any,
    }),
  ]);

  res.json({
    data: tasks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  });
};




export const getTaskById = async (req: Request, res: Response) => {
  const task = await TaskService.getById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json(task);
};

export const updateTask = async (req: Request, res: Response) => {
  const data = updateTaskSchema.parse(req.body);

  const task = await TaskService.update(req.params.id,req.user!.id, {
    ...data,
    dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
  });
  

  res.json(task);
};

export const deleteTask = async (req: Request, res: Response) => {
  await TaskService.delete(req.params.id, req.user!.id);
  res.status(200).json({success: true});
};
