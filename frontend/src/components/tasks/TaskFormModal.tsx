import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTask, updateTask } from "@/services/task.service";
import { getUsers } from "@/services/user.service";
import type { Task } from "@/types/task";
import type { User } from "@/types/user";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  taskFormSchema, type TaskFormValues,
} from "@/lib/validators/task.form.schema";

interface Props {
  open: boolean;
  onClose: () => void;
  task?: Task;
}

export default function TaskFormModal({ open, onClose, task }: Props) {
  const queryClient = useQueryClient();

  /* ---------------- USERS DROPDOWN ---------------- */
  const {
    data: users = [],
    isLoading: usersLoading,
    isError: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  /* ---------------- FORM ---------------- */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      dueDate: task?.dueDate?.slice(0, 10),
      priority: task?.priority ?? "MEDIUM",
      status: task?.status ?? "TODO",
      assignedToId: task?.assignedToId ?? "",
    },
  });

  /* ---------------- MUTATION (OPTIMISTIC) ---------------- */
  const mutation = useMutation({
    mutationFn: (data: TaskFormValues) =>
      task ? updateTask(task.id, data) : createTask(data),

    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      if (!task) {
        queryClient.setQueryData<Task[]>(["tasks"], (old = []) => [
          ...old,
          {
            ...newTask,
            id: "temp-id",
            createdAt: new Date().toISOString(),
          } as Task,
        ]);
      }

      return { previousTasks };
    },

    onError: (_err, _data, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onClose();
    },
  });

  /* ---------------- UI STATES ---------------- */
  if (usersLoading) return <div>Loading users...</div>;
  if (usersError) return <div>Failed to load users</div>;

  /* ---------------- RENDER ---------------- */
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          {task ? "Update Task" : "Create Task"}
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
        >
          <input
            {...register("title")}
            className="w-full border p-2 rounded"
            placeholder="Title"
          />
          {errors.title && (
            <p className="text-sm text-red-500">
              {errors.title.message}
            </p>
          )}

          <textarea
            {...register("description")}
            className="w-full border p-2 rounded"
            placeholder="Description"
          />
          {errors.description && (
            <p className="text-sm text-red-500">
              {errors.description.message}
            </p>
          )}

          <input
            type="date"
            {...register("dueDate")}
            className="w-full border p-2 rounded"
          />

          <select {...register("priority")} className="w-full border p-2 rounded">
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>

          <select {...register("status")} className="w-full border p-2 rounded">
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="REVIEW">Review</option>
            <option value="COMPLETED">Completed</option>
          </select>

          {/* 👇 USER DROPDOWN */}
          <select
            {...register("assignedToId")}
            className="w-full border p-2 rounded"
          >
            <option value="">Assign user</option>
            {users.map((user: User) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
          {errors.assignedToId && (
            <p className="text-sm text-red-500">
              {errors.assignedToId.message}
            </p>
          )}

          <Button className="w-full" disabled={mutation.isPending}>
            {mutation.isPending
              ? "Saving..."
              : task
              ? "Update Task"
              : "Create Task"}
          </Button>

          {mutation.isError && (
            <p className="text-sm text-red-500">
              Something went wrong
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
