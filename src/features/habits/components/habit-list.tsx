import { CheckSquare } from "lucide-react"
import { HabitCard } from "./habit-card"
import { EmptyState } from "@/shared/components/empty-state"
import { HabitSkeleton } from "@/shared/components/loading-skeleton"
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
    return (
      <EmptyState
        icon={CheckSquare}
        title="No habits yet"
        description="Create your first habit to start building routines."
        action={onCreate ? { label: "Create habit", onClick: onCreate } : undefined}
      />
    )
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
