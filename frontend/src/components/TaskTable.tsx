import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Task, Priority, Status } from "@/types/task";

const priorityVariantMap: Record<Priority, "default" | "destructive" | "outline"> =
{
  LOW: "outline",
  MEDIUM: "default",
  HIGH: "destructive",
  URGENT: "destructive",
};

const statusVariantMap: Record<Status, "secondary" | "default"> = {
  TODO: "secondary",
  IN_PROGRESS: "default",
  REVIEW: "default",
  COMPLETED: "secondary",
};

export default function TaskTable({ tasks }: { tasks: Task[] }) {
  return (
    <div className="rounded-xl border overflow-hidden">

    <div className="rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-muted-foreground font-medium">Title</TableHead>
            <TableHead className="text-muted-foreground font-medium">Status</TableHead>
            <TableHead className="text-muted-foreground font-medium">Priority</TableHead>
            <TableHead className="text-muted-foreground font-medium">Due Date</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {tasks.map((task) => (
            <TableRow className="hover:bg-muted/50 transition" key={task.id}>
              <TableCell className="font-medium">
                {task.title}
              </TableCell>

              <TableCell>
                <Badge variant={statusVariantMap[task.status]}>
                  {task.status.replace("_", " ")}
                </Badge>
              </TableCell>

              <TableCell>
                <Badge className={`${priorityVariantMap[task.priority] === "destructive" ? "bg-red-100 text-red-800" : priorityVariantMap[task.priority] === "outline" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`} variant={priorityVariantMap[task.priority]}>
                  {task.priority}
                </Badge>
              </TableCell>

              <TableCell>
                {new Date(task.dueDate).toLocaleDateString()}
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
    </div>
  );
}
