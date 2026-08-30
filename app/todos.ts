import { db, DB_FILE } from "./db";
import { Todo, todos } from "./db/schema";

export async function listTodos(): Promise<Todo[]> {
  return db.select().from(todos);
}

export async function insertInto(title: string): Promise<void> {
  await db.insert(todos).values({ title: title });
}

export type { Todo };
export { DB_FILE };
