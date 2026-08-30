import { ne } from "drizzle-orm";
import { db } from "../db";
import { tasks } from "../db/schema";

export async function getActiveTasks() {
  return db.select().from(tasks).where(ne(tasks.isDone, true));
}
