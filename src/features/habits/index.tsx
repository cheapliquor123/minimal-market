import { useState } from "react"
import { Plus } from "lucide-react"
import { PageHeader } from "@/shared/components/layout/page-header"
import { Button } from "@/shared/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog"
import { useHabits, useDeleteHabit } from "./hooks/use-habits"
import { useHabitLogs, useLogHabit, useStreaks, useTodayLogs } from "./hooks/use-habit-logs"
import { HabitList } from "./components/habit-list"
import { useToday } from "@/stores/date-store"
import { useHabitDialogStore } from "@/stores/habit-dialog-store"

export function HabitsPage() {
  const today = useToday()
  const openCreate = useHabitDialogStore((s) => s.openCreate)
  const openEdit = useHabitDialogStore((s) => s.openEdit)

  const { data: habits = [], isLoading } = useHabits()
  const { data: logs = [] } = useHabitLogs()
  const deleteHabit = useDeleteHabit()
  const logHabit = useLogHabit()

  const streaks = useStreaks(habits, logs)
  const todayLogs = useTodayLogs(logs)

  const [deleteId, setDeleteId] = useState<string | null>(null)

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
        onDelete={setDeleteId}
        onCreate={() => openCreate()}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete habit?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The habit and all its logs will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) deleteHabit.mutate(deleteId)
                setDeleteId(null)
              }}
              className="bg-destructive text-destructive-foreground border-2 border-border shadow-shadow hover:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px]"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
