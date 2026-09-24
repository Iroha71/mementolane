import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

// 0:00〜23:30を30分刻みで48コマ。見出しは正時のみHH形式で表示し、30分の列は空欄
const TIME_SLOTS = Array.from({ length: 48 }, (_, i) =>
  i % 2 === 0 ? String(i / 2).padStart(2, "0") : "",
);

const getThisWeekDates = (): Date[] => {
  const today = new Date();
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  // getDay()は日曜=0のため、月曜起点の経過日数に変換する
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return date;
  });
};

const formatDate = (date: Date): string => {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${mm}/${dd}（${WEEKDAYS[date.getDay()]}）`;
};

const cellKey = (dayIndex: number, slotIndex: number) =>
  `${dayIndex}-${slotIndex}`;

export default function EffortList() {
  const weekDates = useMemo(() => getThisWeekDates(), []);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleCell = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="border-collapse">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 border border-[#FFFFFF] bg-background" />
            {TIME_SLOTS.map((time, slotIndex) => (
              <th
                key={slotIndex}
                className="h-7.5 w-7.5 min-w-7.5 border border-[#FFFFFF] p-0 text-[10px] font-normal"
              >
                {time}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weekDates.map((date, dayIndex) => (
            <tr key={date.toISOString()}>
              <th className="sticky left-0 z-10 border border-[#FFFFFF] bg-background px-2 text-sm font-normal whitespace-nowrap">
                {formatDate(date)}
              </th>
              {TIME_SLOTS.map((_, slotIndex) => {
                const key = cellKey(dayIndex, slotIndex);
                return (
                  <td
                    key={slotIndex}
                    onClick={() => toggleCell(key)}
                    className={cn(
                      "h-7.5 w-7.5 min-w-7.5 cursor-pointer border border-[#FFFFFF] p-0",
                      selected.has(key) ? "bg-primary" : "bg-muted",
                    )}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
