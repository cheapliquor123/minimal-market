import { CheckSquare } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { HabitCard } from "./habit-card"
import type { Habit, HabitLog } from "../types"

interface HabitListProps {
  habits: Habit[]
  streaks: Record<string, number>
  todayLogs: Map<string, HabitLog>
  isLoading?: boolean
  onToggle: (habitId: string, value: number) => void
  onEdit: (habit: Habit) => void
  onDelete: (habitId: string) => void
  onCreate?: () => void
}

function EmptyState({ onCreate }: { onCreate?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-base border-2 border-dashed border-border py-12 text-center">
      <CheckSquare className="size-10 text-muted-foreground" />
      <p className="text-sm font-medium">No habits yet</p>
      <p className="text-xs text-muted-foreground">
        Create your first habit to start building routines.
      </p>
      {onCreate && (
        <Button size="sm" onClick={onCreate} className="mt-1 bg-main text-main-foreground border-2 border-border shadow-shadow hover:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px]">
          Create habit
        </Button>
      )}
    </div>
  )
}

function HabitSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-base border-2 border-border bg-secondary-background p-4 shadow-shadow animate-pulse">
      <div className="flex items-center gap-2">
        <div className="size-3 rounded-full bg-muted" />
        <div className="h-3 w-24 rounded bg-muted" />
      </div>
      <div className="h-8 w-full rounded bg-muted" />
    </div>
  )
}

export function HabitList({
  habits,
  streaks,
  todayLogs,
  isLoading,
  onToggle,
  onEdit,
  onDelete,
  onCreate,
}: HabitListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <HabitSkeleton />
        <HabitSkeleton />
        <HabitSkeleton />
      </div>
    )
  }

  if (habits.length === 0) {
    return <EmptyState onCreate={onCreate} />
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          streak={streaks[habit.id] ?? 0}
          todayLog={todayLogs.get(habit.id)}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
