import { getActiveTasks } from "./services/taskService";

export default async function Home() {
  const tasks = await getActiveTasks();

  return (
    <div className="container py-4">
      <h2 className="h5 mt-4">リスト一覧</h2>
      <ul className="list-group">
        {tasks.map((todo) => (
          <li key={todo.id} className="list-group-item">
            {todo.id} {todo.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
