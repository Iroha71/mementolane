import Image from "next/image";
import { listTodos } from "./todos";
import { addTodo } from "./actions";

export default async function Home() {
  const todos = await listTodos();

  return (
    <div>
      <p>フォーム</p>
      <form action={addTodo}>
        <input type="text" name="title" />
        <button type="submit">追加</button>
      </form>

      <p>リスト一覧</p>
      <ul>
        {todos.map((todo) => (
          <li>
            {todo.id} {todo.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
