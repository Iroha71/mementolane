import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { CardSchema } from "../../../shared/cardSchema";
import TaskList from "@/components/TaskList";
import { Button } from "@/components/ui/button";

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
  // セルのkey -> 割り当てたタスクのid
  const [selectedCell, setSelectedCell] = useState<Map<string, number>>(
    new Map(),
  );
  const [tasks, setTasks] = useState<CardSchema[]>([]);
  const [selectedTask, setSelectedTask] = useState<CardSchema | null>(null)
  // セル描画時にタスクidからthemeColorを引くための索引
  const taskById = useMemo(
    () => new Map(tasks.map((task) => [task.id, task])),
    [tasks],
  );

  useEffect(() => {
    window.api.getAllTasks().then((result) => {
      if (result.success) {
        setTasks(result.tasks);
      } else {
        alert(result.message);
      }
    });
  }, []);

  // 保存は週単位の置き換えのため、既存の工数を読み込んでから編集させる
  useEffect(() => {
    window.api.getWeekEfforts(weekDates[0]).then((result) => {
      if (!result.success) {
        alert(result.message);
        return;
      }

      const cells = new Map<string, number>();
      result.data.forEach((block) => {
        const dayIndex = weekDates.findIndex(
          (date) => date.getTime() === block.date.getTime(),
        );
        if (dayIndex !== -1) {
          cells.set(cellKey(dayIndex, block.blockNumber), block.cardId);
        }
      });
      setSelectedCell(cells);
    });
  }, [weekDates]);

  const saveEfforts = () => {
    const blocks = [...selectedCell].map(([key, cardId]) => {
      const [dayIndex, slotIndex] = key.split("-").map(Number);
      return { date: weekDates[dayIndex], cardId, blockNumber: slotIndex };
    });

    window.api
      .saveWeekEfforts({ weekStart: weekDates[0], blocks })
      .then((result) => {
        alert(result.success ? "工数を保存しました" : result.message);
      });
  };

  const setInputTaskData = (id: string) => {
    const parsedId = parseInt(id);
    const task = tasks.find((task) => task.id === parsedId);
    if (task === null || task === undefined)
      setSelectedTask(null);
    else
      setSelectedTask(task);
  }

  const toggleCell = (key: string) => {
    // 割り当て済みのセルはタスク未選択でも解除できるようにする
    if (selectedCell.has(key)) {
      setSelectedCell((prev) => {
        const next = new Map(prev);
        next.delete(key);
        return next;
      });
      return;
    }

    if (selectedTask === null) {
      alert("タスクが選択されていません");
      return;
    }

    const taskId = selectedTask.id;
    setSelectedCell((prev) => new Map(prev).set(key, taskId));
  };

  return (
    <>
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
                  const taskId = selectedCell.get(key);
                  const themeColor =
                    taskId !== undefined
                      ? taskById.get(taskId)?.themeColor
                      : undefined;
                  return (
                    <td
                      key={slotIndex}
                      onClick={() => toggleCell(key)}
                      className={cn(
                        "h-7.5 w-7.5 min-w-7.5 cursor-pointer border border-[#FFFFFF] p-0 text-center text-[10px]",
                        taskId === undefined && "bg-muted",
                      )}
                      style={{ backgroundColor: themeColor }}
                    >
                      {taskId}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="m-4 flex justify-end">
        <Button onClick={saveEfforts}>保存</Button>
      </div>
      <TaskList tasks={tasks} onValueChange={(taskId) => setInputTaskData(taskId)} />
      <div>
        現在のタスク：{String(selectedTask?.id)}
      </div>
    </>
  );
}
