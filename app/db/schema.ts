import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { task } from "../messages";

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name", { length: 30 }).notNull(),
  startAt: text("start_at"),
  dueAt: text("due_at"),
  status: text("status", { length: 10 }).default(task.plan),
  detail: text("detail", { length: 200 }),
  isDone: integer("is_done", { mode: "boolean" }).notNull().default(false),
});

export type Task = typeof tasks.$inferSelect;
