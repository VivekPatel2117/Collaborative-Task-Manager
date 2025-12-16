import { useState } from "react";
import { Pencil, Trash } from "lucide-react";

import type { Task, Priority, Status } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import TaskFormModal from "./TaskFormModal";
import DeleteTaskDialog from "./DeleteTaskDialog";

/* ---------------- Badge Variants ---------------- */

const priorityVariant: Record<
  Priority,
  "default" | "destructive" | "outline"
> = {
  LOW: "outline",
  MEDIUM: "default",
  HIGH: "destructive",
  URGENT: "destructive",
};

const statusVariant: Record<Status, "secondary" | "default"> = {
  TODO: "secondary",
  IN_PROGRESS: "default",
  REVIEW: "default",
  COMPLETED: "secondary",
};

export default function TaskTable({ tasks }: { tasks: Task[] }) {
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <>
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tasks.map((task) => (
              <TableRow
                key={task.id}
                className="hover:bg-muted/50 transition"
              >
                <TableCell className="font-medium">
                  {task.title}
                </TableCell>

                <TableCell>
                  <Badge variant={statusVariant[task.status]}>
                    {task.status.replace("_", " ")}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge variant={priorityVariant[task.priority]}>
                    {task.priority}
                  </Badge>
                </TableCell>

                <TableCell>
                  {new Date(task.dueDate).toLocaleDateString()}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditTask(task)}
                    >
                      <Pencil size={16} />
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setDeleteId(task.id)}
                    >
                      <Trash
                        size={16}
                        className="text-destructive"
                      />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {tasks.length === 0 && (
          <div className="p-6 text-center text-muted-foreground">
            No tasks found
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {editTask && (
        <TaskFormModal
          open
          task={editTask}
          onClose={() => setEditTask(null)}
        />
      )}

      {/* DELETE DIALOG */}
      {deleteId && (
        <DeleteTaskDialog
          taskId={deleteId}
          onClose={() => setDeleteId(null)}
        />
      )}
    </>
  );
}
