import { Pencil } from "lucide-react";
import { Field, FieldContent, FieldLabel, FieldTitle } from "./ui/field";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

export default function StatusRadioGroup() {
  return (
    <ToggleGroup type="single" variant="outline" defaultValue="plan">
        <ToggleGroupItem value="plan" aria-label="予定" className="size-16 flex flex-col items-center justify-center">
          <span className="text-2xl leading-none font-light">
            <Pencil />
          </span>
          <span className="text-xs text-muted-foreground">予定</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="thisweek" aria-label="予定" className="size-16 flex flex-col items-center justify-center">
          <span className="text-2xl leading-none font-light">
            <Pencil />
          </span>
          <span className="text-xs text-muted-foreground">予定</span>
        </ToggleGroupItem>
      </ToggleGroup>
    // <RadioGroup defaultValue="plan" className="flex ">
    //   <FieldLabel htmlFor="plan">
    //     <Field orientation="horizontal">
    //       <FieldContent>
    //         <FieldTitle>予定</FieldTitle>
    //       </FieldContent>
    //       <RadioGroupItem value="plan" id="plan" />
    //     </Field>
    //   </FieldLabel>
    //   <FieldLabel htmlFor="thisweek">
    //     <Field orientation="horizontal">
    //       <FieldContent>
    //         <FieldTitle>今週やること</FieldTitle>
    //       </FieldContent>
    //       <RadioGroupItem value="thisweek" id="thisweek" />
    //     </Field>
    //   </FieldLabel>
    //   <FieldLabel htmlFor="wip">
    //     <Field orientation="horizontal">
    //       <FieldContent>
    //         <FieldTitle>作業中</FieldTitle>
    //       </FieldContent>
    //       <RadioGroupItem value="wip" id="wip" />
    //     </Field>
    //   </FieldLabel>
    //   <FieldLabel htmlFor="inreview">
    //     <Field orientation="horizontal">
    //       <FieldContent>
    //         <FieldTitle>レビュー中</FieldTitle>
    //       </FieldContent>
    //       <RadioGroupItem value="inreview" id="inreview" />
    //     </Field>
    //   </FieldLabel>
    //   <FieldLabel htmlFor="delivering">
    //     <Field orientation="horizontal">
    //       <FieldContent>
    //         <FieldTitle>検収中</FieldTitle>
    //       </FieldContent>
    //       <RadioGroupItem value="delivering" id="delivering" />
    //     </Field>
    //   </FieldLabel>
    // </RadioGroup>
  )
}