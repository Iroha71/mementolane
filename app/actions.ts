"use server";

import { revalidatePath } from "next/cache";
import { insertInto } from "./todos";

export async function addTodo(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  await insertInto(title);
  revalidatePath("/");
}
