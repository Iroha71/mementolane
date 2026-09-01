"use client";

import { task } from "@/app/messages";
import { createTaskAction, CreateTaskState } from "@/app/actions/task";
import { TaskSchema } from "@/app/validators/task"
import { useActionState } from "react";

interface TaskEditFormProps {
  task?: TaskSchema
}

export default function TaskEditForm (props: TaskEditFormProps) {
  const initialState: CreateTaskState = { success: false }
  const [state, formAction, isPending] = useActionState(createTaskAction, initialState)
  return (
    <form action={formAction} className="mx-auto" style={{ maxWidth: "30rem" }}>
      <div className="mb-4">
        <label htmlFor="name" className="form-label">{task.name}</label>
        <input type="text" id="name" className="form-control" name="name" />
        {state.errors?.name && (
          <div className="text-danger small mt-1">{state.errors.name[0]}</div>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="status" className="form-label">{task.status}</label>
        <select name="status" id="status" className="form-select">
          <option value={task.plan}>{task.plan}</option>
          <option value={task.thisweek}>{task.thisweek}</option>
          <option value={task.wip}>{task.wip}</option>
          <option value={task.inreview}>{task.inreview}</option>
          <option value={task.inspection}>{task.inspection}</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="startAt" className="form-label">{task.startAt}・{task.dueAt}</label>
        <div className="input-group">
          <input
            type="date"
            className="form-control"
            name="startAt"
            id="startAt"
            onClick={(e) => e.currentTarget.showPicker()}
          />
          <input
            type="date"
            className="form-control"
            name="dueAt"
            onClick={(e) => e.currentTarget.showPicker()}
          />
        </div>
        {state.errors?.startAt && (
          <div className="text-danger small mt-1">{state.errors.startAt[0]}</div>
        )}
        {state.errors?.dueAt && (
          <div className="text-danger small mt-1">{state.errors.dueAt[0]}</div>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="detail" className="form-label">{task.detail}</label>
        <textarea name="detail" id="detail" className="form-control"></textarea>
        {state.errors?.detail && (
          <div className="text-danger small mt-1">{state.errors.detail[0]}</div>
        )}
      </div>
      <div className="mb-4 d-flex justify-content-center">
        <button type="submit" className="btn btn-primary" disabled={isPending}>登録する</button>
      </div>
    </form>
  )
}