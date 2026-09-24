import z, { date, number } from "zod";

const effortBlock = z.object({
  id: number(),
  date: date({ error: "形式が不正です" }),
  cardId: number({ error: "形式が不正です" }),
  blockNumber: number({ error: "不正な値が入力されました" })
    .min(0, { error: "00:00～23:00以外の時間が入力されました" })
    .max(47, { error: "00:00～23:00以外の時間が入力されました" }),
});

export type EffortBlock = z.infer<typeof effortBlock>;

export const effortBlockRequest = effortBlock.omit({
  id: true,
});

export type EffortBlockRequest = z.input<typeof effortBlockRequest>;

export const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// 1週間分の工数をまとめて保存するリクエスト。blocksはweekStartから7日以内の日付のみ許可する
export const saveWeekEffortsRequest = z
  .object({
    weekStart: date({ error: "形式が不正です" }),
    blocks: z.array(effortBlockRequest),
  })
  .refine(
    ({ weekStart, blocks }) =>
      blocks.every(
        (block) =>
          block.date.getTime() >= weekStart.getTime() &&
          block.date.getTime() < weekStart.getTime() + WEEK_MS,
      ),
    { error: "対象週以外の日付が含まれています" },
  );

export type SaveWeekEffortsRequest = z.input<typeof saveWeekEffortsRequest>;

export type EffortBlocksResult =
  | { success: true; data: EffortBlock[] }
  | { success: false; message: string };
