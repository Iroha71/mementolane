import { eq } from "drizzle-orm";
import { db } from "../db";
import { tasks, Task } from "../db/schema";
import { TaskSchema } from "../validators/task";

export async function getActiveTasks() {
  return db.select().from(tasks).where(eq(tasks.isDone, false));
}

export async function createTask(task: TaskSchema): Promise<Task> {
  const [record] = await db.insert(tasks).values({
    name: task.name,
    startAt: task.startAt,
    dueAt: task.dueAt,
    status: task.status,
    detail: task.detail,
    isDone: task.isDone,
  }).returning()

  return record
}

export type { Task }