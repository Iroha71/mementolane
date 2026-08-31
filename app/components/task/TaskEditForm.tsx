import { TaskSchema } from "@/app/validators/task";
import Form from "next/form"
import { useActionState } from "react";

interface TaskEditFormProps {
  task?: TaskSchema
}

export default function TaskEditForm (props: TaskEditFormProps) {
  return (
    <Form action="">
      <div className="mb-3">
        <label htmlFor="taskTitle">タイトル</label>
        <input type="text" className="form-control" id="taskTitle" />
      </div>
    </Form>
  )
}