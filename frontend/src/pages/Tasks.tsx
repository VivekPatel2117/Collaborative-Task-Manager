import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/services/task.service";
import TaskTable from "@/components/tasks/TaskTable";
import TaskFormModal from "@/components/tasks/TaskFormModal";
import { Button } from "@/components/ui/button";
import TasksSkeleton from "@/components/skeletons/TasksSkeleton";

// 1. Import your store
import { useTaskStore } from "@/store/task.store";

export default function Tasks() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 8;

  // 2. Extract store actions and state
  const { tasks, setTasks } = useTaskStore();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["tasks", page],
    queryFn: () => getTasks({ page, limit }),
  });

  // 3. Sync API data to Zustand Store
  useEffect(() => {
    if (data?.data) {
      setTasks(data.data);
    }
  }, [data, setTasks]);

  if (isLoading) return <TasksSkeleton />;

  // 4. Important: Use 'tasks' from the store, not local 'data.data'
  // This ensures that when a socket update hits the store, the UI changes!
  const totalPages = data?.totalPages || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <Button onClick={() => setOpen(true)}>Create Task</Button>
      </div>

      {/* Use the reactive store variable here */}
      <TaskTable tasks={tasks} />

      <TaskFormModal open={open} onClose={() => setOpen(false)} />

      {/* Pagination */}
      <div className="flex gap-3 items-center">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </Button>

        <span className="text-sm">
          Page {page} of {totalPages} {isFetching && "…"}
        </span>

        <Button
          variant="outline"
          disabled={page >= totalPages || totalPages === 0}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}