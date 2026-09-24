import { and, asc, gte, lt } from "drizzle-orm";
import { EffortBlock, EffortBlockRequest } from "../../shared/effortBlockSchema";
import { getDb } from "../db/client";
import { effortBlock } from "../db/schema";

export async function registEffort(
  date: Date,
  cardId: number,
  blockNumber: number,
): Promise<EffortBlock> {
  try {
    const db = getDb();

    const [result] = await db
      .insert(effortBlock)
      .values({
        date: date,
        cardId: cardId,
        blockNumber: blockNumber,
      })
      .returning();

    return result;
  } catch (err) {
    console.error(err);

    throw err;
  }
}

const inWeek = (weekStart: Date, weekEnd: Date) =>
  and(gte(effortBlock.date, weekStart), lt(effortBlock.date, weekEnd));

export function getWeekEfforts(weekStart: Date, weekEnd: Date): EffortBlock[] {
  const db = getDb();

  return db
    .select()
    .from(effortBlock)
    .where(inWeek(weekStart, weekEnd))
    .orderBy(asc(effortBlock.date), asc(effortBlock.blockNumber))
    .all();
}

// 対象週の工数を削除してから全件を登録し直す。途中で失敗した場合はロールバックされる
export function saveWeekEfforts(
  weekStart: Date,
  weekEnd: Date,
  blocks: EffortBlockRequest[],
): EffortBlock[] {
  const db = getDb();

  // better-sqlite3のトランザクションは同期のため、awaitせず.run()/.all()で実行する
  return db.transaction((tx) => {
    tx.delete(effortBlock).where(inWeek(weekStart, weekEnd)).run();

    if (blocks.length === 0) {
      return [];
    }

    return tx.insert(effortBlock).values(blocks).returning().all();
  });
}
