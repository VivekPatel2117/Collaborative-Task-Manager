import { useMemo, useState, useEffect } from "react"; // Added useEffect
import { useQuery } from "@tanstack/react-query";

import TaskTable from "@/components/Dashboard/TaskTable";
import TaskFilters from "@/components/Dashboard/TaskFilters";
import TaskStats from "@/components/Dashboard/TaskStats";
import { getTasks } from "@/services/task.service";
import type { Priority, Status, Task } from "@/types/task";
import { useAuth } from "@/hooks/useAuth";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";

// 1. Import the store
import { useTaskStore } from "@/store/task.store";

export default function Dashboard() {
  const { user } = useAuth();
  
  // 2. Extract state and actions from TaskStore
  const { tasks: storeTasks, setTasks } = useTaskStore();

  const [status, setStatus] = useState<Status | "all">("all");
  const [priority, setPriority] = useState<Priority | "all">("all");
  const [sortByDueDate, setSortByDueDate] = useState<"asc" | "desc">("asc");

  /* ---------------- FETCH TASKS ---------------- */
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tasks", "dashboard"],
    queryFn: () => getTasks({ page: 1, limit: 10 }), // Increased limit slightly for better filtering
  });

  // 3. Sync API data to Zustand Store
  useEffect(() => {
    if (data?.data) {
      setTasks(data.data);
    }
  }, [data, setTasks]);

  /* ---------------- FILTER + SORT ---------------- */
  const filteredTasks = useMemo(() => {
    // 4. IMPORTANT: Use storeTasks here instead of data?.data
    let result = [...storeTasks];

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
  }, [storeTasks, status, priority, sortByDueDate]);

  if (isLoading) return <DashboardSkeleton />;

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load tasks
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-background">
      <div>
        <h1 className="text-3xl font-semibold">User Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your tasks and stay organized
        </p>
      </div>

      {/* 5. Stats now use storeTasks, reacting to Socket changes */}
      {user && (
        <TaskStats tasks={storeTasks} currentUser={user.id} />
      )}

      <div className="space-y-4 rounded-xl border bg-card p-6">
        <TaskFilters
          status={status}
          priority={priority}
          sortByDueDate={sortByDueDate}
          onStatusChange={setStatus}
          onPriorityChange={setPriority}
          onSortChange={setSortByDueDate}
        />

        {/* Show only first 3 filtered results */}
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