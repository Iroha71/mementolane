import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const card = sqliteTable("cards", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title", { length: 30 }).notNull(),
  status: text("status", { length: 20 }).notNull().default("plan"),
  startAt: text("start_at"),
  dueAt: text("due_at"),
  detail: text("detail", { length: 200 }),
  isDone: integer("is_done", { mode: "boolean" }).default(false).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const effortBlock = sqliteTable("effort_blocks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: integer("targetDate", { mode: "timestamp" }).notNull(),
  cardId: integer("card_id")
    .references(() => card.id)
    .notNull(),
  blockNumber: integer("block_number").notNull(),
});
