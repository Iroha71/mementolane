import z from "zod";
import { db } from "../db";
import { Task, tasks } from "../db/schema";

export interface SerializedTask {
  id: number;
  name: string;
}

export function toSerialized(task: Task): SerializedTask {
  return {
    id: task.id,
    name: task.name,
  };
}

export async function createTask(
  name: string,
  status?: string,
  startAt?: string,
  dueAt?: string,
  detail?: string,
) {
  try {
    const result = await db
      .insert(tasks)
      .values({
        name: name,
        startAt: startAt,
        dueAt: dueAt,
        status: status,
        detail: detail,
        isDone: false,
      })
      .returning();

    console.log(result);
    return toSerialized(result[0]);
  } catch (error) {
    console.error(error);
    throw new Error("DB保存時にエラーが発生しました。再度実行してください。");
  }
}
