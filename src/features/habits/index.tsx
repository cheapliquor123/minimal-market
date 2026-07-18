import { Plus } from "lucide-react"
import { useMemo } from "react"
import { PageHeader } from "@/shared/components/layout/page-header"
import { Button } from "@/shared/components/ui/button"
import { ConfirmDialog } from "@/shared/components/confirm-dialog"
import { useHabits, useDeleteHabit } from "./hooks/use-habits"
import { useHabitLogs, useLogHabit, calculateStreaks, getTodayLogs } from "./hooks/use-habit-logs"
import { HabitList } from "./components/habit-list"
import { useToday } from "@/stores/date-store"
import { useHabitDialogStore } from "@/stores/habit-dialog-store"
import { useDeleteConfirmation } from "@/shared/hooks/use-delete-confirmation"

export function HabitsPage() {
  const today = useToday()
  const openCreate = useHabitDialogStore((s) => s.openCreate)
  const openEdit = useHabitDialogStore((s) => s.openEdit)

  const { data: habits = [], isLoading } = useHabits()
  const { data: logs = [] } = useHabitLogs()
  const deleteHabit = useDeleteHabit()
  const logHabit = useLogHabit()

  const streaks = useMemo(() => calculateStreaks(habits, logs), [habits, logs])
  const todayLogs = useMemo(() => getTodayLogs(logs, today), [logs, today])

  const { deleteId, confirm, cancel } = useDeleteConfirmation()

  function handleToggle(habitId: string, value: number) {
    logHabit.mutate({ habitId, date: today, value })
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Habits"
        description="Track your daily routines"
      />

      <Button onClick={() => openCreate()} className="w-fit bg-main text-main-foreground border-2 border-border shadow-shadow hover:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px]">
        <Plus className="size-4" />
        Add habit
      </Button>

      <HabitList
        habits={habits}
        streaks={streaks}
        todayLogs={todayLogs}
        isLoading={isLoading}
        onToggle={handleToggle}
        onEdit={openEdit}
        onDelete={confirm}
        onCreate={() => openCreate()}
      />

      <ConfirmDialog
        open={!!deleteId}
        onCancel={cancel}
        onConfirm={() => {
          if (deleteId) deleteHabit.mutate(deleteId)
          cancel()
        }}
        title="Delete habit?"
        description="This action cannot be undone. The habit and all its logs will be permanently deleted."
      />
    </div>
  )
}
