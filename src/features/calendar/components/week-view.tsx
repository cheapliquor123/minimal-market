import { getWeekDays, isSameDay, isToday, format, toDateStr } from "../utils"
import { Badge } from "@/shared/components/ui/badge"
import { cn } from "@/shared/lib/utils"
import type { CalendarDayData } from "../hooks/use-calendar-data"

interface WeekViewProps {
  currentDate: Date
  selectedDate: Date | null
  dataByDate: Map<string, CalendarDayData>
  onSelectDate: (date: Date) => void
}

const priorityBadge: Record<string, "destructive" | "warning" | "info"> = {
  high: "destructive",
  medium: "warning",
  low: "info",
}

export function WeekView({ currentDate, selectedDate, dataByDate, onSelectDate }: WeekViewProps) {
  const days = getWeekDays(currentDate)

  return (
    <div className="grid grid-cols-7 gap-1">
      {days.map((day) => {
        const dateStr = toDateStr(day)
        const dayData = dataByDate.get(dateStr)
        const today = isToday(day)
        const selected = selectedDate && isSameDay(day, selectedDate)

        return (
          <button
            key={dateStr}
            type="button"
            onClick={() => onSelectDate(day)}
            className={cn(
              "flex flex-col rounded-base border-2 p-2 text-left transition-all min-h-[300px]",
              today && "border-main shadow-shadow",
              selected && "border-main bg-main/10 -translate-x-[1px] -translate-y-[1px] shadow-shadow",
              !selected && !today && "border-border bg-secondary-background hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-shadow",
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-heading text-muted-foreground">
                {format(day, "EEE")}
              </span>
              <span
                className={cn(
                  "text-sm font-heading",
                  today && "text-main font-bold",
                )}
              >
                {format(day, "d")}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              {dayData?.tasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    "rounded-base border border-border px-1.5 py-0.5 text-[10px] leading-tight truncate",
                    task.completed && "line-through opacity-50",
                  )}
                >
                  <div className="flex items-center gap-1">
                    <Badge variant={priorityBadge[task.priority]} className="text-[8px] px-1 py-0">
                      {task.priority[0].toUpperCase()}
                    </Badge>
                    <span className="truncate">{task.title}</span>
                  </div>
                </div>
              ))}
              {dayData && dayData.tasks.length > 4 && (
                <span className="text-[10px] text-muted-foreground">
                  +{dayData.tasks.length - 4} more
                </span>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
