import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  cardRequestSchema,
  CardRequestFieldErrors,
  CardRequestSchema,
} from "../../shared/cardSchema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { message } from "../../shared/message";
import { Input } from "./ui/input";
import { InputGroup } from "./ui/input-group";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import StatusRadioGroup from "./StatusRadioGroup";

const STATUS_OPTIONS = Object.values(message.card.statuses);

interface TaskFormProps {
  mode?: "create" | "update";
  className?: string;
  title?: string;
  startAt?: string;
  dueAt?: string;
  detail?: string;
  isDone?: boolean;
  status: string;
  error?: string;
  fieldErrors?: CardRequestFieldErrors;
  onSubmit: SubmitHandler<CardRequestSchema>;
}

export default function TaskForm({
  mode = "create",
  className,
  title,
  startAt,
  dueAt,
  detail,
  isDone,
  status,
  error,
  fieldErrors,
  onSubmit,
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    control,
    formState: { errors, isLoading, isValid },
  } = useForm<
    z.input<typeof cardRequestSchema>,
    unknown,
    CardRequestSchema
  >({
    resolver: zodResolver(cardRequestSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      title: title ? title : "",
      startAt: startAt ? startAt : null,
      dueAt: dueAt ? dueAt : null,
      detail: detail ? detail : "",
      status: status,
      isDone: isDone ?? false,
    },
  });

  const fieldErrorsFor = (field: keyof CardRequestSchema) => {
    const serverMessages = fieldErrors?.[field] ?? [];
    const serverErrors = serverMessages.map((message) => ({ message }));

    return [errors[field], ...serverErrors];
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          {mode === "update" ? "タスクの編集" : "タスクの作成"}
        </CardTitle>
        <CardDescription>
          {mode === "update"
            ? "タスクの情報を編集してください"
            : "作成するタスクの情報を入力してください"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel>{message.card.title}</FieldLabel>
              <Input maxLength={30} {...register("title")} />
              <FieldError errors={fieldErrorsFor("title")} />
            </Field>
            <Field>
              <FieldLabel>{message.card.status}</FieldLabel>
              <StatusRadioGroup />
              <FieldError errors={fieldErrorsFor("status")} />
            </Field>
            <Field>
              <FieldLabel>
                {message.card.startAt} / {message.card.dueAt}
              </FieldLabel>
              <InputGroup>
                <Input
                  type="date"
                  {...register("startAt", {
                    onChange: (e) => {
                      if (!getValues("dueAt")) {
                        setValue("dueAt", e.target.value, {
                          shouldValidate: true,
                        });
                      }
                    },
                  })}
                />
                <Input type="date" {...register("dueAt")} />
              </InputGroup>
              <FieldError errors={fieldErrorsFor("startAt")} />
              <FieldError errors={fieldErrorsFor("dueAt")} />
            </Field>
            <Field>
              <FieldLabel>{message.card.detail}</FieldLabel>
              <Textarea maxLength={200} {...register("detail")} />
              <FieldError errors={fieldErrorsFor("detail")} />
            </Field>
            <Field>
              {error && <p className="text-red-500">{error}</p>}
              <Button type="submit" disabled={!isValid}>
                {mode === "update" ? "更新する" : "登録する"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
