import StatusLane from "./components/task/StatusLane";
import { task } from "./messages";
import { getActiveTasks } from "./services/taskService";

export default async function Home() {
  const tasks = await getActiveTasks();
  const tasksOf = (status: string) => tasks.filter((t) => t.status === status);

  return (
    <div className="flex-fill overflow-hidden px-4 pt-3 pb-4">
      <div className="row flex-nowrap g-3 h-100 overflow-auto">
        <StatusLane
          status={task.plan}
          borderClassName="border-secondary-subtle"
          badgeClassName="bg-secondary-subtle text-secondary-emphasis"
          tasks={tasksOf(task.plan)}
        />
        <StatusLane
          status={task.thisweek}
          borderClassName="border-danger"
          badgeClassName="text-bg-danger"
          tasks={tasksOf(task.thisweek)}
        />
        <StatusLane
          status={task.wip}
          borderClassName="border-warning"
          badgeClassName="bg-warning-subtle text-warning-emphasis"
          tasks={tasksOf(task.wip)}
        />
        <StatusLane
          status={task.inreview}
          borderClassName="border-primary"
          badgeClassName="bg-primary-subtle text-primary-emphasis"
          tasks={tasksOf(task.inreview)}
        />
        <StatusLane
          status={task.inspection}
          borderClassName="border-success"
          badgeClassName="bg-success-subtle text-success-emphasis"
          tasks={tasksOf(task.inspection)}
        />
      </div>
    </div>
  );
}
