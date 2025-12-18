import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Priority, Status } from "@/types/task";

interface Props {
  status: Status | "all";
  priority: Priority | "all";
  sortByDueDate: "asc" | "desc";
  onStatusChange: (v: Status | "all") => void;
  onPriorityChange: (v: Priority | "all") => void;
  onSortChange: (v: "asc" | "desc") => void;
}

export default function TaskFilters({
  status,
  priority,
  sortByDueDate,
  onStatusChange,
  onPriorityChange,
  onSortChange,
}: Props) {
  return (
   <div className="flex flex-wrap gap-3 items-center">

      {/* STATUS FILTER */}
      <Select
        value={status}
        onValueChange={(v) => onStatusChange(v as Status | "all")}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="TODO">To Do</SelectItem>
          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
          <SelectItem value="REVIEW">Review</SelectItem>
          <SelectItem value="COMPLETED">Completed</SelectItem>
        </SelectContent>
      </Select>

      {/* PRIORITY FILTER */}
      <Select
        value={priority}
        onValueChange={(v) => onPriorityChange(v as Priority | "all")}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="LOW">Low</SelectItem>
          <SelectItem value="MEDIUM">Medium</SelectItem>
          <SelectItem value="HIGH">High</SelectItem>
          <SelectItem value="URGENT">Urgent</SelectItem>
        </SelectContent>
      </Select>

      {/* SORT */}
      <Button
        variant="outline"
        className="gap-2"
        onClick={() =>
          onSortChange(sortByDueDate === "asc" ? "desc" : "asc")
        }
      >
        Sort by Due Date {sortByDueDate === "asc" ? "↑" : "↓"}
      </Button>

    </div>
  );
}
