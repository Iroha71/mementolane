import { boolean, iso, number, string, z } from "zod";
import { message } from "./message";

const cardLabel = message.card;

const dateField = (label: string) =>
  z.preprocess(
    (val) => (val === "" ? null : val),
    iso
      .date({
        error: `${label}はyyyy-mm-dd形式で入力してください`,
      })
      .nullable()
      .optional(),
  );

const cardSchema = z.object({
  id: number(),
  title: string()
    .min(1, { error: `${cardLabel.title}は必須です` })
    .max(30, { error: `${cardLabel.title}は30字以内で入力してください` }),
  status: string()
    .min(1, { error: `${cardLabel.status}は必須です` })
    .max(20, { error: `${cardLabel.status}は20字以内で入力してください` }),
  startAt: dateField(cardLabel.startAt),
  dueAt: dateField(cardLabel.dueAt),
  detail: string()
    .max(200, {
      error: `${cardLabel.detail}は200字以内で入力してください`,
    })
    .nullable()
    .optional(),
  isDone: boolean().default(false),
});

export type CardSchema = z.infer<typeof cardSchema>;

export const cardRequestSchema = cardSchema.omit({ id: true });

export type CardRequestSchema = z.infer<typeof cardRequestSchema>;

export type CardRequestFieldErrors = Partial<
  Record<keyof CardRequestSchema, string>
>;

export type InsertTaskResult =
  | { success: true; data: CardSchema }
  | {
      success: false;
      fieldErrors?: CardRequestFieldErrors;
      message?: string;
    };
