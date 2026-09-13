import React from "react";
import { Link } from "react-router";
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
import { CardSchema } from "../../shared/cardSchema";
import TaskCard from "./TaskCard";

interface StatusLaneProps {
  status: {
    label: string;
    value: string;
  };
  variant: string;
  icon: React.JSX.Element;
  cards: CardSchema[];
}

function getCardsByStatus(status: string, cards: CardSchema[]): CardSchema[] {
  return cards.filter((card) => card.status === status);
}

export default function StatusLane({
  status,
  variant,
  icon,
  cards,
}: StatusLaneProps) {
  return (
    <Card className="py-2">
      <CardHeader className="px-2">
        <CardTitle>
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-2 py-1",
              variant,
            )}
          >
            {icon}
            {status.label}
          </span>
        </CardTitle>
        <CardAction>
          <Badge className={variant}>
            {getCardsByStatus(status.value, cards).length}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2">
        {getCardsByStatus(status.value, cards).length > 0 ? (
          getCardsByStatus(status.value, cards).map((card) => (
            <TaskCard
              key={card.id}
              id={card.id}
              title={card.title}
              startAt={card.startAt}
              dueAt={card.dueAt}
              detail={card.detail}
              isDone={card.isDone}
            />
          ))
        ) : (
          <div className="w-[18rem]">
            <p>タスクがありません</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="px-2">
        <Button asChild variant="outline" className="w-full">
          <Link to={`/tasks/new/${status.value}`}>＋タスクを追加する</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
