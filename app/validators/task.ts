import { z } from "zod";
import { task } from "../messages";

/** ローカル時刻基準の今日（YYYY-MM-DD） */
function today() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${now.getFullYear()}-${month}-${day}`;
}

export const taskSchema = z.object({
  name: z
    .string()
    .min(5, `${task.name}は5文字以上で入力してください`)
    .max(30, `${task.name}は30文字以内で入力してください`),
  startAt: z.iso
    .date()
    .refine((v) => v >= today(), `${task.startAt}は今日以降を指定してください`)
    .optional(),
  dueAt: z.iso
    .date()
    .refine((v) => v >= today(), `${task.dueAt}は今日以降を指定してください`)
    .optional(),
  status: z
    .enum([task.plan, task.thisweek, task.wip, task.inreview, task.inspection])
    .default(task.plan),
  detail: z
    .string()
    .min(5, `${task.detail}は5文字以上で入力してください`)
    .max(200, `${task.detail}は200文字以内で入力してください`)
    .optional(),
  isDone: z.boolean().default(false),
});

export type TaskSchema = z.infer<typeof taskSchema>;
