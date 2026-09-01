"use server";

import { createTask, Task } from "@/app/services/taskService";
import { taskSchema } from "@/app/validators/task";

export interface CreateTaskState {
  success: boolean;
  task?: Task;
  errors?: Record<string, string[] | undefined>;
}

export async function createTaskAction(
  _prevState: CreateTaskState,
  formData: FormData
): Promise<CreateTaskState> {
  const parsed = taskSchema.safeParse({
    name: formData.get("name"),
    startAt: formData.get("startAt") || undefined,
    dueAt: formData.get("dueAt") || undefined,
    status: formData.get("status"),
    detail: formData.get("detail") || undefined,
  });

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const task = await createTask(parsed.data);
    return { success: true, task };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
}
