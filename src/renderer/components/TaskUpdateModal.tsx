import { DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import TaskForm from "./TaskForm";
import { useEffect, useState } from "react";
import {
  CardRequestFieldErrors,
  CardRequestSchema,
  CardSchema,
} from "../../shared/cardSchema";
import { SubmitHandler } from "react-hook-form";

interface TaskUpdateModalProps {
  taskId: number;
  onSuccess?: () => void;
}

export default function TaskUpdateModal({
  taskId,
  onSuccess,
}: TaskUpdateModalProps) {
  const [task, setTask] = useState<CardSchema | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saveError, setSaveError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<
    CardRequestFieldErrors | undefined
  >(undefined);

  useEffect(() => {
    setIsLoading(true);

    window.api
      .getTask(taskId)
      .then((task) => {
        setTask(task);
      })
      .catch((err) => {
        setSaveError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [taskId]);

  const onSubmit: SubmitHandler<CardRequestSchema> = async (data) => {
    setSaveError("");
    setFieldErrors(undefined);

    const result = await window.api.updateTask(taskId, data);

    if (!result.success) {
      if (result.fieldErrors) setFieldErrors(result.fieldErrors);
      if (result.message) setSaveError(result.message);

      return;
    }

    onSuccess?.();
  };

  return (
    <DialogContent className="sm:max-w-145">
      <DialogHeader>
        <DialogTitle>タスクの更新</DialogTitle>
      </DialogHeader>
      {isLoading ? (
        <p className="text-neutral-500">読み込み中です...</p>
      ) : !task ? (
        <p className="text-red-500">指定されたタスクが見つかりません。</p>
      ) : (
        <TaskForm
          className="w-full"
          mode="update"
          title={task.title}
          dueAt={task.dueAt ?? undefined}
          startAt={task.startAt ?? undefined}
          status={task.status}
          detail={task.detail ?? undefined}
          isDone={task.isDone}
          error={saveError}
          fieldErrors={fieldErrors}
          onSubmit={onSubmit}
        />
      )}
    </DialogContent>
  );
}
