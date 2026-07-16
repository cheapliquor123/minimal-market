import { Plus, CheckCircle } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { format, isToday, toDateStr } from "../utils"
import { cn } from "@/shared/lib/utils"
import type { CalendarDayData } from "../hooks/use-calendar-data"

interface DayDetailProps {
  date: Date
  dataByDate: Map<string, CalendarDayData>
  onAddTask: (dateStr: string) => void
}

const priorityBadge: Record<string, "destructive" | "warning" | "info"> = {
  high: "destructive",
  medium: "warning",
  low: "info",
}

export function DayDetail({ date, dataByDate, onAddTask }: DayDetailProps) {
  const dateStr = toDateStr(date)
  const dayData = dataByDate.get(dateStr)
  const today = isToday(date)
  const tasks = dayData?.tasks ?? []

  return (
    <div className="flex flex-col gap-4 rounded-base border-2 border-border bg-secondary-background p-4 shadow-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-8 items-center justify-center rounded-base border-2 border-border font-heading text-sm shadow-shadow",
              today ? "bg-main text-main-foreground" : "bg-background",
            )}
          >
            {format(date, "d")}
          </div>
          <div>
            <h3 className="font-heading text-sm">{format(date, "EEEE")}</h3>
            <p className="text-[10px] text-muted-foreground">{format(date, "MMM d, yyyy")}</p>
          </div>
        </div>
        <Button
          size="xs"
          onClick={() => onAddTask(dateStr)}
          className="bg-main text-main-foreground border-2 border-border shadow-shadow hover:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px]"
        >
          <Plus className="size-3" />
          Task
        </Button>
      </div>

      {tasks.length > 0 ? (
        <div className="flex flex-col gap-1">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-2 py-1">
              <CheckCircle
                className={cn(
                  "size-3.5 shrink-0",
                  task.completed ? "text-success" : "text-muted-foreground",
                )}
              />
              <span
                className={cn(
                  "text-xs flex-1",
                  task.completed && "line-through text-muted-foreground",
                )}
              >
                {task.title}
              </span>
              <Badge variant={priorityBadge[task.priority]} className="text-[9px]">
                {task.priority}
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground text-center py-2">
          Nothing scheduled. Add a task above.
        </p>
      )}
    </div>
  )
}
