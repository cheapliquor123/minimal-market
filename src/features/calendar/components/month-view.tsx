import { getMonthDays, DAY_LABELS, isSameMonth, isSameDay, isToday, format, toDateStr } from "../utils"
import { cn } from "@/shared/lib/utils"
import type { CalendarDayData } from "../hooks/use-calendar-data"

interface MonthViewProps {
  currentDate: Date
  selectedDate: Date | null
  dataByDate: Map<string, CalendarDayData>
  onSelectDate: (date: Date) => void
}

const PRIORITY_COLORS: Record<string, string> = {
  high: "bg-destructive",
  medium: "bg-warning",
  low: "bg-info",
}

export function MonthView({ currentDate, selectedDate, dataByDate, onSelectDate }: MonthViewProps) {
  const days = getMonthDays(currentDate)

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-7 gap-1">
        {DAY_LABELS.map((label) => (
          <div key={label} className="py-1 text-center text-xs font-heading text-muted-foreground">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dateStr = toDateStr(day)
          const dayData = dataByDate.get(dateStr)
          const inMonth = isSameMonth(day, currentDate)
          const today = isToday(day)
          const selected = selectedDate && isSameDay(day, selectedDate)
          const taskCount = dayData?.tasks.length ?? 0
          const hasItems = taskCount > 0

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => onSelectDate(day)}
              className={cn(
                "relative flex min-h-[48px] min-w-[48px] flex-col gap-1 rounded-base border-2 p-1.5 text-left transition-all",
                inMonth
                  ? "border-border bg-secondary-background"
                  : "border-transparent bg-background/50",
                today && "border-main shadow-shadow",
                selected && "border-main bg-main/10 -translate-x-[1px] -translate-y-[1px] shadow-shadow",
                !selected && inMonth && "hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-shadow",
                !selected && !today && "hover:border-border",
              )}
            >
              <span
                className={cn(
                  "text-xs font-heading",
                  !inMonth && "text-muted-foreground/50",
                  today && "text-main font-bold",
                )}
              >
                {format(day, "d")}
              </span>

              {hasItems && (
                <div className="flex flex-wrap gap-0.5 mt-auto">
                  {dayData?.tasks.slice(0, 3).map((task) => (
                    <span
                      key={task.id}
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        PRIORITY_COLORS[task.priority],
                      )}
                      title={task.title}
                    />
                  ))}
                  {taskCount > 3 && (
                    <span className="text-[8px] text-muted-foreground">
                      +{taskCount - 3}
                    </span>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
