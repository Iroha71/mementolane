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
    <div className="col-8 col-sm-6 col-md-4 col-lg-3 col-xl-2 h-100">
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
              isDone={task.isDone}
            />
          ))}
          {props.tasks.length === 0 && (
            <p className="small text-body-secondary mb-0">タスクなし</p>
          )}
        </div>
        <div className="p-2 w-100">
          <button className="btn btn-secondary w-100">＋ 追加する</button>
        </div>
      </div>
    </div>
  );
}
