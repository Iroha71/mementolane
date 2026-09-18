import { EffortBlock } from "../../shared/effortBlockSchema";
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
