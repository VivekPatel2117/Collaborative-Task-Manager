import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import TaskTable from "@/components/TaskTable";
import TaskFilters from "@/components/TaskFilters";
import TaskStats from "@/components/TaskStats";
import { getTasks } from "@/services/task.service";
import type { Task, Priority, Status } from "@/types/task";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();

  const [status, setStatus] = useState<Status | "all">("all");
  const [priority, setPriority] = useState<Priority | "all">("all");
  const [sortByDueDate, setSortByDueDate] = useState<"asc" | "desc">("asc");

  /* ---------------- FETCH TASKS FROM DB ---------------- */
  const {
    data: tasks = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  /* ---------------- FILTER + SORT ---------------- */
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (status !== "all") {
      result = result.filter((t) => t.status === status);
    }

    if (priority !== "all") {
      result = result.filter((t) => t.priority === priority);
    }

    result.sort((a, b) =>
      sortByDueDate === "asc"
        ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
    );

    return result;
  }, [tasks, status, priority, sortByDueDate]);

  /* ---------------- UI STATES ---------------- */
  if (isLoading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load tasks
      </div>
    );
  }

  /* ---------------- RENDER ---------------- */
  return (
    <div className="p-8 space-y-8 bg-background">
  {/* HEADER */}
  <div>
    <h1 className="text-3xl font-semibold">
      User Dashboard
    </h1>
    <p className="text-sm text-muted-foreground mt-1">
      Track your tasks and stay organized
    </p>
  </div>

  {/* STATS */}
  {user && (
    <TaskStats tasks={tasks} currentUser={user.id} />
  )}

  {/* FILTERS + TABLE */}
  <div className="space-y-4 rounded-xl border bg-card p-6">
    <TaskFilters
      status={status}
      priority={priority}
      sortByDueDate={sortByDueDate}
      onStatusChange={setStatus}
      onPriorityChange={setPriority}
      onSortChange={setSortByDueDate}
    />

    <TaskTable tasks={filteredTasks.slice(0, 3)} />

    {filteredTasks.length > 3 && (
      <div className="flex justify-end">
        <button
          className="text-sm text-primary font-medium hover:underline"
          onClick={() => (window.location.href = "/tasks")}
        >
          See more →
        </button>
      </div>
    )}
  </div>
</div>

  );
}
