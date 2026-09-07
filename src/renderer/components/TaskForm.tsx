import { zodResolver } from "@hookform/resolvers/zod";
import { cardRequestSchema, CardRequestSchema } from "../../shared/cardSchema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "./ui/field";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { message } from "../../shared/message";
import { Input } from "./ui/input";
import { InputGroup } from "./ui/input-group";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

interface TaskFormProps {
  title?: string;
  startAt?: string;
  dueAt?: string;
  detail?: string;
  status: string;
}

export default function TaskForm({
  title,
  startAt,
  dueAt,
  status,
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading, isValid },
  } = useForm<CardRequestSchema>({
    resolver: zodResolver(cardRequestSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      title: title ? title : "",
      startAt: startAt ? startAt : null,
      dueAt: dueAt ? dueAt : null,
      status: status,
      isDone: false,
    },
  });

  const onSubmit: SubmitHandler<CardRequestSchema> = (data) =>
    console.log(data);

  return (
    <Card className="w-[30rem]">
      <CardHeader>
        <CardTitle>タスクの作成</CardTitle>
        <CardDescription>
          作成するタスクの情報を入力してください
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel>{message.card.title}</FieldLabel>
              <Input maxLength={30} {...register("title")} />
              {errors.title && (
                <FieldDescription className="text-red-500">
                  {errors.title.message}
                </FieldDescription>
              )}
            </Field>
            <Field>
              <FieldLabel>{message.card.status}</FieldLabel>
              <Input {...register("status")} />
            </Field>
            <Field>
              <FieldLabel>
                {message.card.startAt} / {message.card.dueAt}
              </FieldLabel>
              <InputGroup>
                <Input type="date" {...register("startAt")} />
                <Input type="date" {...register("dueAt")} />
              </InputGroup>
              {errors.startAt && (
                <FieldDescription className="text-red-500">
                  {errors.startAt.message}
                </FieldDescription>
              )}
              {errors.dueAt && (
                <FieldDescription className="text-red-500">
                  {errors.dueAt.message}
                </FieldDescription>
              )}
            </Field>
            <Field>
              <FieldLabel>{message.card.detail}</FieldLabel>
              <Textarea maxLength={200} {...register("detail")} />
              {errors.detail && (
                <FieldDescription className="text-red-500">
                  {errors.detail.message}
                </FieldDescription>
              )}
            </Field>
          </FieldGroup>

          <Button type="submit" disabled={!isValid}>
            {isValid ? <p>true</p> : <p>false</p>}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
