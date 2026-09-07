import TaskForm from "../../components/TaskForm";

interface TaskCreateProps {
  status: string;
}

export default function TaskCreate({ status }: TaskCreateProps) {
  return <TaskForm status={status} />;
}
