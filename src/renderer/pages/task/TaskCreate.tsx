import { Link, useNavigate } from "react-router";
import { SubmitHandler } from "react-hook-form";
import TaskForm from "../../components/TaskForm";
import {
  CardRequestFieldErrors,
  CardRequestSchema,
} from "../../../shared/cardSchema";
import { useState } from "react";

interface TaskCreateProps {
  status: string;
}

export default function TaskCreate({ status }: TaskCreateProps) {
  const navigate = useNavigate();
  const [saveError, setSaveError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<
    CardRequestFieldErrors | undefined
  >(undefined);

  const onSubmit: SubmitHandler<CardRequestSchema> = async (data) => {
    setSaveError("");
    setFieldErrors(undefined);

    const result = await window.api.addTask(data);

    if (!result.success) {
      if (result.fieldErrors) setFieldErrors(result.fieldErrors);
      if (result.message) setSaveError(result.message);

      return;
    }

    navigate("/");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <TaskForm
        status={status}
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
