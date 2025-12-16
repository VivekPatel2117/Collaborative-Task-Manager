import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteTask } from "@/services/task.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function DeleteTaskDialog({
  taskId,
  onClose,
}: {
  taskId: string;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onClose();
    },
  });

  return (
    <AlertDialog open onOpenChange={onClose}>
      <AlertDialogContent>
        <p>Are you sure you want to delete this task?</p>
        <div className="flex gap-3 mt-4">
          <Button variant="destructive" onClick={() => mutation.mutate()}>
            Delete
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
