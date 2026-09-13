import Database from "better-sqlite3";
import { eq, ne } from "drizzle-orm";
import { getDb } from "../db/client";
import { card } from "../db/schema";
import { CardRequestSchema, CardSchema } from "../../shared/cardSchema";

export async function getActiveTasks(): Promise<CardSchema[]> {
  try {
    const db = getDb();

    return await db.select().from(card).where(ne(card.isDone, true));
  } catch (err) {
    if (!(err instanceof Database.SqliteError)) {
      throw err;
    }

    console.error(err);

    return [];
  }
}

export function sendMessage(msg: string) {
  console.log(msg);
}

export async function getTaskById(id: number): Promise<CardSchema | null> {
  try {
    const db = getDb();

    const [result] = await db.select().from(card).where(eq(card.id, id));

    return result ?? null;
  } catch (err) {
    if (!(err instanceof Database.SqliteError)) {
      throw err;
    }

    console.error(err);

    return null;
  }
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
    if (!(err instanceof Database.SqliteError)) {
      throw err;
    }

    console.error(err);

    throw new Error(
      "タスクの登録に失敗しました。もう一度やり直してください。",
      {
        cause: err,
      },
    );
  }
}

export async function updateTask(
  id: number,
  request: CardRequestSchema,
): Promise<CardSchema | null> {
  try {
    const db = getDb();

    const [result] = await db
      .update(card)
      .set({
        title: request.title,
        status: request.status,
        startAt: request.startAt,
        dueAt: request.dueAt,
        detail: request.detail,
        isDone: request.isDone,
      })
      .where(eq(card.id, id))
      .returning();

    return result ?? null;
  } catch (err) {
    if (!(err instanceof Database.SqliteError)) {
      throw new Database.SqliteError(
        "データ保存に失敗しました。再度試してください。",
        "500",
      );
    }

    console.error(err);

    throw new Error(
      "タスクの更新に失敗しました。もう一度やり直してください。",
      {
        cause: err,
      },
    );
  }
}
