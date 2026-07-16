import { format, isToday, toDateStr } from "../utils"
import { Badge } from "@/shared/components/ui/badge"
import { CheckCircle } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import type { CalendarDayData } from "../hooks/use-calendar-data"

interface DayViewProps {
  currentDate: Date
  dataByDate: Map<string, CalendarDayData>
}

const priorityBadge: Record<string, "destructive" | "warning" | "info"> = {
  high: "destructive",
  medium: "warning",
  low: "info",
}

export function DayView({ currentDate, dataByDate }: DayViewProps) {
  const dateStr = toDateStr(currentDate)
  const dayData = dataByDate.get(dateStr)
  const today = isToday(currentDate)
  const tasks = dayData?.tasks ?? []

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex size-12 items-center justify-center rounded-base border-2 border-border font-heading text-lg shadow-shadow",
            today ? "bg-main text-main-foreground" : "bg-secondary-background",
          )}
        >
          {format(currentDate, "d")}
        </div>
        <div>
          <h3 className="font-heading text-base">{format(currentDate, "EEEE")}</h3>
          <p className="text-xs text-muted-foreground">{format(currentDate, "MMMM d, yyyy")}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="text-xs font-heading text-muted-foreground uppercase tracking-wide">Tasks</h4>
        {tasks.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  "flex items-center gap-2 rounded-base border-2 border-border bg-secondary-background p-2.5 shadow-shadow",
                  task.completed && "opacity-60",
                )}
              >
                <CheckCircle
                  className={cn(
                    "size-4 shrink-0",
                    task.completed ? "text-success" : "text-muted-foreground",
                  )}
                />
                <span
                  className={cn(
                    "text-sm flex-1",
                    task.completed && "line-through text-muted-foreground",
                  )}
                >
                  {task.title}
                </span>
                <Badge variant={priorityBadge[task.priority]} className="text-[10px]">
                  {task.priority}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No tasks for this day.</p>
        )}
      </div>
    </div>
  )
}
