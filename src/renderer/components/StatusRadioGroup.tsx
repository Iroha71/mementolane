import {
  ArrowRight,
  Construction,
  MessageCircleCode,
  Package,
  Pencil,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

interface StatusRadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
}

export default function StatusRadioGroup({
  value,
  onValueChange,
}: StatusRadioGroupProps) {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      className="w-full"
      value={value}
      onValueChange={onValueChange}
    >
      <ToggleGroupItem
        value="plan"
        aria-label="予定"
        className="flex-1 size-16 flex flex-col items-center justify-center"
      >
        <span className="text-2xl leading-none font-light">
          <Pencil />
        </span>
        <span className="text-xs text-muted-foreground">予定</span>
      </ToggleGroupItem>
      <ToggleGroupItem
        value="thisweek"
        aria-label="今週やること"
        className="flex-1 size-16 flex flex-col items-center justify-center"
      >
        <span className="text-2xl leading-none font-light">
          <ArrowRight />
        </span>
        <span className="text-xs text-muted-foreground">
          今週
          <br />
          やること
        </span>
      </ToggleGroupItem>
      <ToggleGroupItem
        value="wip"
        aria-label="作業中"
        className="flex-1 size-16 flex flex-col items-center justify-center"
      >
        <span className="text-2xl leading-none font-light">
          <Construction />
        </span>
        <span className="text-xs text-muted-foreground">作業中</span>
      </ToggleGroupItem>
      <ToggleGroupItem
        value="inreview"
        aria-label="レビュー中"
        className="flex-1 size-16 flex flex-col items-center justify-center"
      >
        <span className="text-2xl leading-none font-light">
          <MessageCircleCode />
        </span>
        <span className="text-xs text-muted-foreground">レビュー中</span>
      </ToggleGroupItem>
      <ToggleGroupItem
        value="delivering"
        aria-label="検収中"
        className="flex-1 size-16 flex flex-col items-center justify-center"
      >
        <span className="text-2xl leading-none font-light">
          <Package />
        </span>
        <span className="text-xs text-muted-foreground">検収中</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
