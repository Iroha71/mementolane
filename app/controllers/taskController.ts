"use server";

import z, { email } from "zod";
import { createTask, SerializedTask } from "../repositories/taskRepository";
import { cardSchema } from "../schemas/task";

export interface CardFormState {
  errors?: Record<string, string[] | undefined>;
  values?: SerializedTask;
}

export default async function createCard(
  currentState: CardFormState,
  formData: FormData,
): Promise<CardFormState> {
  const raw = Object.fromEntries(
    Array.from(formData.entries(), ([key, value]) => [
      key,
      value === "" ? undefined : value,
    ]),
  );
  const parsedData = cardSchema.safeParse(raw);

  console.log(raw);
  console.log(parsedData);

  if (!parsedData.success) {
    console.log(z.flattenError(parsedData.error).fieldErrors);
    return {
      errors: z.flattenError(parsedData.error).fieldErrors,
      values: currentState.values,
    };
  }

  try {
    const params = parsedData.data;
    const result = await createTask(
      params.name,
      params.status,
      params.startAt,
      params.dueAt,
      params.detail,
    );

    console.log(result);
    return {
      values: result,
    };
  } catch (error) {
    return {
      errors: { email: [String(error)] },
    };
  }
}
