import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const todos = sqliteTable("todos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  done: integer("done", { mode: "boolean" }).notNull().default(false),
});

export type Todo = typeof todos.$inferSelect;

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name", { length: 30 }).notNull(),
  startAt: text("start_at"),
  dueAt: text("due_at").notNull(),
  status: text("status", { length: 10 }).notNull(),
  detail: text("detail", { length: 200 }),
  isDone: integer("is_done", { mode: "boolean" }).default(false),
});

export type Task = typeof tasks.$inferSelect;
