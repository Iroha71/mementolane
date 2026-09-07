import React from "react";
import { cn } from "cn";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { CardSchama } from "../../shared/cardSchema";
import TaskCard from "./TaskCard";

interface StatusLaneProps {
  status: {
    label: string;
    value: string;
  };
  variant: string;
  icon: React.JSX.Element;
  cards: CardSchama[]
}

export default function StatusLane({ status, variant, icon, cards }: StatusLaneProps) {
  return (
    <Card className="py-2">
      <CardHeader className="px-2">
        <CardTitle>
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-2 py-1",
              variant
            )}
          >
            {icon}
            {status.label}
          </span>
        </CardTitle>
        <CardAction>
          <Badge className={variant}>1</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2">
        {cards.filter((card) => card.status === status.value).map((card) => (
          <TaskCard title={card.title} startAt={card.startAt} dueAt={card.dueAt} detail={card.detail} isDone={card.isDone} />
        ))}
      </CardContent>
      <CardFooter className="px-2">
        <Button>＋タスクを追加する</Button>
      </CardFooter>
    </Card>
  );
}
