import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import type { Task } from "@/types/task";
import { User, FileEdit, AlertTriangle, type LucideIcon } from "lucide-react";
interface Props {
  tasks: Task[];
  currentUser: string;
}

export default function TaskStats({ tasks, currentUser }: Props) {
  const navigate = useNavigate();
  const now = new Date();

  const assignedToMe = tasks.filter(
    (t) => t.assignedToId === currentUser
  );

  const createdByMe = tasks.filter(
    (t) => t.creatorId === currentUser
  );

  const overdueTasks = tasks.filter(
    (t) =>
      new Date(t.dueDate) < now &&
      t.status !== "COMPLETED"
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* ASSIGNED TO ME */}
      <TaskBox
        title="Assigned to Me"
        tasks={assignedToMe}
        icon={User}
        onSeeMore={() => navigate("/tasks?assignedTo=me")}
      />

      {/* CREATED BY ME */}
      <TaskBox
        title="Created by Me"
        tasks={createdByMe}
        icon={FileEdit}
        onSeeMore={() => navigate("/tasks?createdBy=me")}
      />

      {/* OVERDUE */}
      <TaskBox
      icon={AlertTriangle}
        title="Overdue Tasks"
        tasks={overdueTasks}
        onSeeMore={() => navigate("/tasks?overdue=true")}
      />
    </div>
  );
}

/* ---------------- SMALL REUSABLE COMPONENT ---------------- */

function TaskBox({
  title,
  tasks,
  icon: Icon,
  onSeeMore,
}: {
  title: string;
  tasks: Task[];
  icon: LucideIcon;
  onSeeMore: () => void;
}) {
  const visibleTasks = tasks.slice(0, 3);

  return (
 <Card className="rounded-xl border shadow-sm">
  <CardContent className="p-5 space-y-4">
    {/* HEADER */}
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold flex gap-1 items-center"><Icon className="text-primary"></Icon>{title}</h3>
      <Button
        variant="ghost"
        size="sm"
        className="text-primary"
        onClick={onSeeMore}
      >
        See more →
      </Button>
    </div>

    {/* TASK LIST */}
    <div className="space-y-3">
      {visibleTasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center justify-between rounded-lg bg-gray-100 px-4 py-3"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">
              {task.title}
            </p>
            <p className="text-xs text-muted-foreground">
              Due {new Date(task.dueDate).toLocaleDateString()}
            </p>
          </div>

          <Badge
            variant="secondary"
            className="rounded-full text-xs bg-gray-200"
          >
            {task.status.replace("_", " ")}
          </Badge>
        </div>
      ))}

      {visibleTasks.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6">
          No tasks
        </p>
      )}
    </div>
  </CardContent>
</Card>

  );
}
