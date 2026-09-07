import { Calendar, Hourglass, Ticket } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

interface TaskCardProps {
  title: string
  startAt?: string | null
  dueAt?: string | null
  detail?: string | null
  isDone: boolean
}

export default function TaskCard ({title, startAt, dueAt, detail, isDone}: TaskCardProps) {
  return (
    <Card className="w-[18rem] py-2 gap-2">
      <CardHeader className="px-2">
        <CardTitle>
          <p className="flex items-center gap-2">
            <Ticket />
            {title}
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 flex flex-col gap-4">
        {startAt ? (
          <div className="flex flex-col gap-2">
            <p className="flex items-center gap-4"><Calendar />開始日 | {startAt}</p>
            <p className="flex items-center gap-4"><Hourglass />期限日 | {dueAt}</p>
          </div>
        ) : null}
        {detail ? (
          <div>
            <p>{detail}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}