import { Link, useNavigate } from "react-router";
import { SubmitHandler } from "react-hook-form";
import TaskForm from "../../components/TaskForm";
import { CardRequestSchema } from "../../../shared/cardSchema";

interface TaskCreateProps {
  status: string;
}

export default function TaskCreate({ status }: TaskCreateProps) {
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<CardRequestSchema> = async (data) => {
    const result = await window.api.addTask(data);

    if (result === null) {
      return;
    }

    navigate("/");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <TaskForm status={status} onSubmit={onSubmit} />
      <Link to="/" className="text-sm text-neutral-500 hover:underline">
        タスク一覧へ戻る
      </Link>
    </div>
  );
}
