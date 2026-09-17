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
