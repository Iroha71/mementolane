import { eq } from "drizzle-orm";
import { db } from "../db";
import { tasks, Task } from "../db/schema";

export async function getActiveTasks() {
  return db.select().from(tasks).where(eq(tasks.isDone, false));
}

export type { Task }