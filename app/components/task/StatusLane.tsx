import type { Task } from "@/app/db/schema";
import TaskCard from "./TaskCard";

interface StatusLaneProps {
  status: string;
  borderClassName: string;
  badgeClassName: string;
  tasks: Task[];
}

export default function StatusLane(props: StatusLaneProps) {
  return (
    <div className="col h-100">
      <div
        className={`h-100 d-flex flex-column overflow-hidden rounded bg-body-tertiary border-top border-4 ${props.borderClassName}`}
      >
        <div className="d-flex align-items-baseline justify-content-between gap-2 px-3 pt-3 pb-2">
          <span className="small fw-semibold">{props.status}</span>
          <span className={`badge ${props.badgeClassName}`}>
            {props.tasks.length}
          </span>
        </div>
        <div className="d-flex flex-column gap-3 overflow-auto px-3 pb-3">
          {props.tasks.map((task) => (
            <TaskCard
              key={task.id}
              name={task.name}
              startAt={task.startAt ?? undefined}
              dueAt={task.dueAt ?? undefined}
              detail={task.detail ?? undefined}
              isDone={task.isDone ?? false}
            />
          ))}
          {props.tasks.length === 0 && (
            <p className="small text-body-secondary mb-0">タスクなし</p>
          )}
        </div>
      </div>
    </div>
  );
}
