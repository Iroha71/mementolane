import { Link, useNavigate } from "react-router";
import { SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import TaskForm from "../../components/TaskForm";
import {
  CardRequestFieldErrors,
  CardRequestSchema,
  CardSchema,
} from "../../../shared/cardSchema";

interface TaskUpdateProps {
  id: number;
}

export default function TaskUpdate({ id }: TaskUpdateProps) {
  const navigate = useNavigate();
  const [task, setTask] = useState<CardSchema | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saveError, setSaveError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<
    CardRequestFieldErrors | undefined
  >(undefined);

  useEffect(() => {
    setIsLoading(true);

    window.api.getTask(id).then((result) => {
      setTask(result);
      setIsLoading(false);
    });
  }, [id]);

  const onSubmit: SubmitHandler<CardRequestSchema> = async (data) => {
    setSaveError("");
    setFieldErrors(undefined);

    const result = await window.api.updateTask(id, data);

    if (!result.success) {
      if (result.fieldErrors) setFieldErrors(result.fieldErrors);
      if (result.message) setSaveError(result.message);

      return;
    }

    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
        <p className="text-neutral-500">読み込み中です...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
        <p className="text-red-500">指定されたタスクが見つかりません。</p>
        <Link to="/" className="text-sm text-neutral-500 hover:underline">
          タスク一覧へ戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <TaskForm
        mode="update"
        title={task.title}
        startAt={task.startAt ?? undefined}
        dueAt={task.dueAt ?? undefined}
        detail={task.detail ?? undefined}
        isDone={task.isDone}
        status={task.status}
        error={saveError}
        fieldErrors={fieldErrors}
        onSubmit={onSubmit}
      />
      <Link to="/" className="text-sm text-neutral-500 hover:underline">
        タスク一覧へ戻る
      </Link>
    </div>
  );
}
