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
    <Card>
      <CardHeader>
        <CardTitle>
          <p className="flex items-center gap-1">
            <Ticket />
            {title}
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {startAt ? (
          <div>
            <p className="flex items-center gap-2"><Calendar />開始日 | {startAt}</p>
            <p className="flex items-center gap-2"><Hourglass />期限日 | {dueAt}</p>
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