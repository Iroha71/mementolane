import { ne } from "drizzle-orm";
import { getDb } from "../db/client";
import { card } from "../db/schema";
import { CardSchama } from "../../shared/cardSchema";

export async function getActiveTasks(): Promise<CardSchama[]> {
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
