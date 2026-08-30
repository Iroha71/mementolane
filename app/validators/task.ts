import z from "zod";
import { task } from "../messages";

const taskSchema = z.object({
  name: z
    .string()
    .min(5, `${task.name}は5文字以上で入力してください`)
    .max(30, `${task.name}は30文字以内で入力してください`),
  startAt: z
    .date()
    .min(new Date(), `${task.startAt}は今日以降を指定してください`)
    .optional(),
  dueAt: z
    .date()
    .min(new Date(), `${task.dueAt}は今日以降を指定してください`)
    .optional(),
  status: z.enum([
    task.plan,
    task.thisweek,
    task.wip,
    task.inreview,
    task.inspection,
  ]),
  detail: z
    .string()
    .min(5, `${task.detail}は5文字以上で入力してください`)
    .max(200, `${task.detail}は200文字以内で入力してください`)
    .optional(),
  isDone: z.boolean().default(false),
});

export type TaskSchema = z.infer<typeof taskSchema>;
