import { DialogContent, DialogTitle } from "radix-ui/dialog";
import { DialogHeader } from "./ui/dialog";
import TaskForm from "./TaskForm";
import { useEffect, useState } from "react";
import { CardRequestSchema, CardSchema } from "../../shared/cardSchema";
import { SubmitHandler } from "react-hook-form";

interface TaskUpdateModalProps {
  taskId: number;
}

export default function TaskUpdateModal ({ taskId }: TaskUpdateModalProps) {
  const [task, setTask] = useState<CardSchema | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  useEffect(() => {
    window.api.getTask(taskId).then((task) => {
      setTask(task);
    }).catch ((err) => {
      setServerError(err);
    })
  }, [taskId]);

  const onSubmit: SubmitHandler<CardRequestSchema> = async (data) => {

  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>タスクの更新</DialogTitle>
        {serverError && <p>{serverError}</p>}
        <TaskForm
          mode="update"
          title={task?.title} 
          dueAt={task?.dueAt ?? ""} 
          startAt={task?.startAt ?? ""}
          status={task?.status ?? "予定"}
          detail={task?.detail ?? ""}
          onSubmit={onSubmit}
        />
      </DialogHeader>
    </DialogContent>
  )
}