import { z } from "zod";
import { Priority, Status } from "@prisma/client";

/**
 * Accepts:
 * - "2025-12-18"
 * - "2025-12-18T10:00:00.000Z"
 */
const dateString = z
  .string()
  .refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  });

export const createTaskSchema = z.object({
  title: z.string().max(100),
  description: z.string(),
  dueDate: dateString,
  priority: z.nativeEnum(Priority),
  status: z.nativeEnum(Status).optional(),
  assignedToId: z.string().uuid(),
});

export const updateTaskSchema = z.object({
  title: z.string().max(100).optional(),
  description: z.string().optional(),
  dueDate: dateString.optional(),
  priority: z.nativeEnum(Priority).optional(),
  status: z.nativeEnum(Status).optional(),
  assignedToId: z.string().uuid().optional(),
});
