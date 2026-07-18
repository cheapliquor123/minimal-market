import { Check, Clock, Hash, Play, Square } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { cn } from "@/shared/lib/utils"
import { useTimer } from "../hooks/use-timer"
import type { Habit, HabitLog } from "../types"

interface HabitCardProps {
  habit: Habit
  streak: number
  todayLog: HabitLog | undefined
  onToggle: (habitId: string, value: number) => void
  onEdit: (habit: Habit) => void
  onDelete: (habitId: string) => void
}

const typeConfig = {
  binary: { icon: Check, label: "Daily" },
  numerical: { icon: Hash, label: "Count" },
  time: { icon: Clock, label: "Timer" },
}

function formatGoal(type: Habit["type"], goal: number | null): string | null {
  if (goal === null) return null
  if (type === "time") return `${goal} min`
  return `${goal}x`
}

function formatRemaining(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m === 0) return `${s}s`
  return `${m}:${s.toString().padStart(2, "0")}`
}

function TimerButtons({
  habit,
  streak,
  todayLog,
  onToggle,
}: {
  habit: Habit
  streak: number
  todayLog: HabitLog | undefined
  onToggle: (habitId: string, value: number) => void
}) {
  const goalMinutes = habit.goal ?? 30
  const todayLogValue = todayLog?.value ?? 0

  const { running, remaining, progress, start, stop } = useTimer({
    goalMinutes,
    onLog: (minutes) => onToggle(habit.id, todayLogValue + minutes),
  })

  const isCompleted = habit.goal !== null && todayLog !== undefined && todayLog.value >= habit.goal

  if (isCompleted) {
    return (
      <Button
        size="sm"
        disabled
        className="flex-1 bg-success text-success-foreground border-2 border-border"
      >
        <Check className="size-4" />
        {streak > 0 ? `${streak} day streak` : "Done today"}
      </Button>
    )
  }

  if (running) {
    return (
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex gap-2">
          <div className="flex flex-1 items-center justify-center rounded-base border-2 border-border bg-secondary-background px-3 py-1 font-heading text-sm shadow-shadow">
            <Clock className="size-3.5 mr-1.5 animate-pulse" />
            {formatRemaining(remaining)}
          </div>
          <Button
            size="sm"
            onClick={() => stop(false)}
            className="bg-destructive text-destructive-foreground border-2 border-border shadow-shadow hover:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px]"
          >
            <Square className="size-4" />
            Stop
          </Button>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-base border border-border">
          <div
            className="h-full bg-main transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <Button
      size="sm"
      onClick={start}
      className="flex-1 bg-main text-main-foreground border-2 border-border shadow-shadow hover:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px]"
    >
      <Play className="size-4" />
      Start ({goalMinutes}m)
    </Button>
  )
}

export function HabitCard({
  habit,
  streak,
  todayLog,
  onToggle,
  onEdit,
  onDelete,
}: HabitCardProps) {
  const typeInfo = typeConfig[habit.type]
  const isCompleted = habit.type === "binary"
    ? !!todayLog
    : todayLog !== undefined && habit.goal !== null && todayLog.value >= habit.goal

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-base border-2 border-border bg-secondary-background p-4 shadow-shadow transition-all",
        "hover:-translate-y-[1px] hover:shadow-none",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="size-3 rounded-full shrink-0"
            style={{ backgroundColor: habit.color }}
          />
          <span className="font-heading text-sm">{habit.name}</span>
        </div>
        <div className="flex items-center gap-1">
          {streak > 0 && (
            <Badge variant="warning" className="text-[10px]">
              {streak}d streak
            </Badge>
          )}
          <Badge variant="outline" className="text-[10px]">
            <typeInfo.icon className="size-3" />
            {typeInfo.label}
          </Badge>
        </div>
      </div>

      {habit.goal !== null && (
        <p className="text-xs text-muted-foreground">
          Goal: {formatGoal(habit.type, habit.goal)}
          {todayLog && habit.type !== "binary" && (
            <span className="ml-1">
              — Today: {todayLog.value}/{habit.goal}
            </span>
          )}
        </p>
      )}

      <div className="flex items-center gap-2">
        {habit.type === "binary" ? (
          <Button
            size="sm"
            disabled={isCompleted}
            onClick={() => onToggle(habit.id, 1)}
            className={cn(
              "flex-1",
              isCompleted
                ? "bg-success text-success-foreground border-2 border-border"
                : "bg-main text-main-foreground border-2 border-border shadow-shadow hover:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px]",
            )}
          >
            <Check className="size-4" />
            {isCompleted ? "Done" : "Mark done"}
          </Button>
        ) : habit.type === "time" ? (
          <TimerButtons habit={habit} streak={streak} todayLog={todayLog} onToggle={onToggle} />
        ) : (
          <Button
            size="sm"
            disabled={isCompleted}
            onClick={() => onToggle(habit.id, (todayLog?.value ?? 0) + 1)}
            className={cn(
              "flex-1",
              isCompleted
                ? "bg-success text-success-foreground border-2 border-border"
                : "bg-main text-main-foreground border-2 border-border shadow-shadow hover:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px]",
            )}
          >
            <Hash className="size-4" />
            {isCompleted ? "Done" : "Log +1"}
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(habit)}
          className="px-2"
        >
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(habit.id)}
          className="px-2 text-destructive"
        >
          Del
        </Button>
      </div>
    </div>
  )
}
