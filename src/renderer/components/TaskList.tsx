import { CardSchema } from "../../shared/cardSchema";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "./ui/field";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface TaskListProps {
  tasks: CardSchema[];
  value?: string;
  onValueChange?: (value: string) => void;
}

export default function TaskList({ tasks, value, onValueChange }: TaskListProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onValueChange}
      className="mx-auto my-4 w-120 gap-1"
    >
      {tasks.map((task) => (
        <FieldLabel key={task.id} htmlFor={`task-${task.id}`}>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>{task.title}</FieldTitle>
            </FieldContent>
            <RadioGroupItem value={String(task.id)} id={`task-${task.id}`} />
          </Field>
        </FieldLabel>
      ))}
    </RadioGroup>
  );
}
