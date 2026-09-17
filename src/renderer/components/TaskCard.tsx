import { Calendar, Hourglass, Pencil, Ticket } from "lucide-react"
import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Dialog, DialogTrigger } from "./ui/dialog"
import TaskUpdateModal from "./TaskUpdateModal"

interface TaskCardProps {
  id: number
  title: string
  startAt?: string | null
  dueAt?: string | null
  detail?: string | null
  isDone: boolean
  onTaskUpdated?: () => void
}

export default function TaskCard ({id, title, startAt, dueAt, detail, isDone, onTaskUpdated}: TaskCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <Card className="w-[18rem] py-2 gap-2">
      <CardHeader className="px-2">
        <CardTitle>
          <p className="flex items-center gap-2">
            <Ticket />
            {title}
          </p>
        </CardTitle>
        <CardAction>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <Pencil />
              </Button>
            </DialogTrigger>
            <TaskUpdateModal
              taskId={id}
              onSuccess={() => {
                setOpen(false)
                onTaskUpdated?.()
              }}
            />
          </Dialog>
        </CardAction>
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