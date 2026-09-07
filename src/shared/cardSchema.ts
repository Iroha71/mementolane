import { boolean, iso, number, string, z } from "zod";
import { message } from "./message";

const cardLabel = message.card;

const cardSchema = z.object({
  id: number(),
  title: string()
    .min(1, { error: `${cardLabel.title}は必須です` })
    .max(30, { error: `${cardLabel.title}は30字以内で入力してください` }),
  status: string()
    .min(1, { error: `${cardLabel.status}は必須です` })
    .max(20, { error: `${cardLabel.status}は20字以内で入力してください` }),
  startAt: iso
    .date({
      error: `${cardLabel.startAt}はyyyy-mm-dd形式で入力してください`,
    })
    .nullable()
    .optional(),
  dueAt: iso
    .date({
      error: `${cardLabel.dueAt}はyyyy-mm-dd形式で入力してください`,
    })
    .nullable()
    .optional(),
  detail: string()
    .max(200, {
      error: `${cardLabel.detail}は200字以内で入力してください`,
    })
    .nullable()
    .optional(),
  isDone: boolean().default(false),
});

export type CardSchema = z.infer<typeof cardSchema>;
