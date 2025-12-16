import { z } from "zod";

export const taskFormSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(5),
  dueDate: z.string(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"]),
  assignedToId: z.string().uuid(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
