interface TaskCardProps {
  name: string;
  startAt?: string;
  isDone: boolean;
  dueAt?: string;
  detail?: string;
}

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

function formatDate(value?: string) {
  if (!value) return "-";

  const date = new Date(value.includes("T") ? value : `${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${month}/${day}（${WEEKDAYS[date.getDay()]}）`;
}

export default function TaskCard(props: TaskCardProps) {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{props.name}</h5>
        <h6 className="card-subtitle text-body-secondary">📅期限</h6>
        <p className="card-text">
          {formatDate(props.startAt)} &gt;&gt; {formatDate(props.dueAt)}
        </p>
        <h6 className="card-subtitle text-body-secondary">📝詳細</h6>
        <p className="card-text">{props.detail}</p>
      </div>
    </div>
  );
}
