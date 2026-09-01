"use client";

import { task } from "@/app/messages";
import { TaskSchema } from "@/app/validators/task";
import { useActionState, useState, type ChangeEvent } from "react";
import createCard, { CardFormState } from "@/app/controllers/taskController";

interface TaskEditFormProps {
  task?: TaskSchema;
}

export default function TaskEditForm(props: TaskEditFormProps) {
  const initialState: CardFormState = {};
  const [state, formAction, isPending] = useActionState(
    createCard,
    initialState,
  );
  const [values, setValues] = useState({
    name: props.task?.name ?? "",
    status: props.task?.status ?? task.plan,
    startAt: props.task?.startAt ?? "",
    dueAt: props.task?.dueAt ?? "",
    detail: props.task?.detail ?? "",
  });

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <form action={formAction} className="mx-auto" style={{ maxWidth: "30rem" }}>
      <div className="mb-4">
        <label htmlFor="name" className="form-label">
          {task.name}
        </label>
        <input
          type="text"
          id="name"
          className="form-control"
          name="name"
          value={values.name}
          onChange={handleChange}
        />
        {state.errors?.name && (
          <div className="text-danger small mt-1">{state.errors.name[0]}</div>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="status" className="form-label">
          {task.status}
        </label>
        <select
          name="status"
          id="status"
          className="form-select"
          value={values.status}
          onChange={handleChange}
        >
          <option value={task.plan}>{task.plan}</option>
          <option value={task.thisweek}>{task.thisweek}</option>
          <option value={task.wip}>{task.wip}</option>
          <option value={task.inreview}>{task.inreview}</option>
          <option value={task.inspection}>{task.inspection}</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="startAt" className="form-label">
          {task.startAt}・{task.dueAt}
        </label>
        <div className="input-group">
          <input
            type="date"
            className="form-control"
            name="startAt"
            id="startAt"
            value={values.startAt}
            onChange={handleChange}
            onClick={(e) => e.currentTarget.showPicker()}
          />
          <input
            type="date"
            className="form-control"
            name="dueAt"
            id="dueAt"
            value={values.dueAt}
            onChange={handleChange}
            onClick={(e) => e.currentTarget.showPicker()}
          />
        </div>
        {state.errors?.startAt && (
          <div className="text-danger small mt-1">
            {state.errors.startAt[0]}
          </div>
        )}
        {state.errors?.dueAt && (
          <div className="text-danger small mt-1">{state.errors.dueAt[0]}</div>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="detail" className="form-label">
          {task.detail}
        </label>
        <textarea
          name="detail"
          id="detail"
          className="form-control"
          value={values.detail}
          onChange={handleChange}
        ></textarea>
        {state.errors?.detail && (
          <div className="text-danger small mt-1">{state.errors.detail[0]}</div>
        )}
      </div>
      <div className="mb-4 d-flex justify-content-center">
        <button type="submit" className="btn btn-primary" disabled={isPending}>
          登録する
        </button>
      </div>
    </form>
  );
}
