import { message } from "../../shared/message";
import StatusLane from "@/components/StatusLane";
import {
  ArrowRight,
  Construction,
  MessageCircleCode,
  Package,
  PencilLine,
} from "lucide-react";
import { useEffect, useState } from "react";
import { CardSchama } from "../../shared/cardSchema";

const STATUSES = [
  {
    value: message.card.statuses.plan,
    variant: "bg-neutral-100 text-neutral-700",
    icon: <PencilLine />,
  },
  {
    value: message.card.statuses.thisWeek,
    variant: "bg-red-100 text-red-600",
    icon: <ArrowRight />,
  },
  {
    value: message.card.statuses.wip,
    variant: "bg-amber-100 text-amber-600",
    icon: <Construction />,
  },
  {
    value: message.card.statuses.inReview,
    variant: "bg-sky-100 text-sky-600",
    icon: <MessageCircleCode />,
  },
  {
    value: message.card.statuses.delivering,
    variant: "bg-green-100 text-green-600",
    icon: <Package />,
  },
];

export default function Home() {
  useEffect(() => {
    window.api.getActiveTasks().then((cards) => {
      setCards(cards);
    });
  }, []);
  const [cards, setCards] = useState<CardSchama[]>([])

  return (
    <div className="flex w-full flex-col p-4">
      <div className="flex w-full items-start gap-2">
        {STATUSES.map((status) => (
          <div key={status.value.value} className="min-w-0 flex-1">
            <StatusLane
              cards={cards}
              status={status.value}
              variant={status.variant}
              icon={status.icon}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
