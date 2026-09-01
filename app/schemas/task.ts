import z, { iso, string } from "zod";
import { task } from "../messages";

const statusSchema = z.enum(
  [task.plan, task.thisweek, task.wip, task.inreview, task.inspection],
  `${task.status}が不正です`,
);

export const cardSchema = z.object({
  name: string(`${task.name}を入力してください`)
    .min(1, `${task.name}を入力してください`)
    .max(30, `${task.name}は30文字以内で入力してください`),
  startAt: iso
    .date(`${task.startAt}はYYYY-MM-DD形式で入力してください`)
    .optional(),
  dueAt: iso.date(`${task.dueAt}はYYYY-MM-DD形式で入力してください`).optional(),
  status: statusSchema.optional().default(task.plan),
  detail: string(`${task.detail}を入力してください`)
    .max(200, `${task.detail}は200文字以内で入力してください`)
    .optional(),
});
