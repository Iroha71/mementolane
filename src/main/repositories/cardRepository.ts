import { ne } from "drizzle-orm";
import { getDb } from "../db/client";
import { card } from "../db/schema";
import { CardRequestSchema, CardSchema } from "../../shared/cardSchema";

export async function getActiveTasks(): Promise<CardSchema[]> {
  try {
    const db = getDb();

    return await db.select().from(card).where(ne(card.isDone, true));
  } catch (err) {
    console.error(err);

    return [];
  }
}

export function sendMessage(msg: string) {
  console.log(msg);
}

export async function insertTask(
  request: CardRequestSchema,
): Promise<CardSchema | null> {
  try {
    const db = getDb();

    const [result] = await db
      .insert(card)
      .values({
        title: request.title,
        status: request.status,
        startAt: request.startAt,
        dueAt: request.dueAt,
        detail: request.detail,
        isDone: request.isDone,
      })
      .returning();

    return result ?? null;
  } catch (err) {
    console.error(err);

    throw new Error("タスクの登録に失敗しました。もう一度やり直してください。", {
      cause: err,
    });
  }
}
