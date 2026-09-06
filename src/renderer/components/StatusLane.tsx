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

interface StatusLaneProps {
  status: {
    label: string;
    value: string;
  };
  variant: string;
  icon: React.JSX.Element;
}

export default function StatusLane({ status, variant, icon }: StatusLaneProps) {
  return (
    <Card>
      <CardHeader>
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
      <CardContent></CardContent>
      <CardFooter>
        <Button>＋タスクを追加する</Button>
      </CardFooter>
    </Card>
  );
}
