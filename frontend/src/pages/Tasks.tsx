import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/services/task.service";
import TaskTable from "@/components/tasks/TaskTable";
import TaskFormModal from "@/components/tasks/TaskFormModal";
import { Button } from "@/components/ui/button";

export default function Tasks() {
  const [open, setOpen] = useState(false);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  if (isLoading) return <div>Loading tasks...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <Button onClick={() => setOpen(true)}>Create Task</Button>
      </div>

      <TaskTable tasks={tasks} />
      <TaskFormModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
