import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { Navbar } from "@/shared/components/layout/navbar"
import { TaskForm } from "@/features/tasks/components/task-form"
import { HabitForm } from "@/features/habits/components/habit-form"
import { useCreateTask, useUpdateTask } from "@/features/tasks/hooks/use-tasks"
import { useCreateHabit, useUpdateHabit } from "@/features/habits/hooks/use-habits"
import { useTaskDialogStore } from "@/stores/task-dialog-store"
import { useHabitDialogStore } from "@/stores/habit-dialog-store"
import { startTodayRefresh, stopTodayRefresh } from "@/stores/date-store"
import { activeTasksApi } from "@/features/tasks/api/api-switch"
import type { CreateTaskInput } from "@/features/tasks/types"
import type { CreateHabitInput } from "@/features/habits/types"

export function RootLayout() {
  const taskDialog = useTaskDialogStore()
  const habitDialog = useHabitDialogStore()
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const createHabit = useCreateHabit()
  const updateHabit = useUpdateHabit()
  const qc = useQueryClient()

  useEffect(() => {
    activeTasksApi.carryForward().catch(() => {})
    startTodayRefresh(() => qc.invalidateQueries())
    return () => stopTodayRefresh()
  }, [qc])

  function handleTaskSubmit(input: CreateTaskInput) {
    if (taskDialog.editingTask) {
      updateTask.mutate(
        { id: taskDialog.editingTask.id, input },
        { onSuccess: () => taskDialog.close() },
      )
    } else {
      createTask.mutate(input, { onSuccess: () => taskDialog.close() })
    }
  }

  function handleHabitSubmit(input: CreateHabitInput) {
    if (habitDialog.editingHabit) {
      updateHabit.mutate(
        { id: habitDialog.editingHabit.id, input },
        { onSuccess: () => habitDialog.close() },
      )
    } else {
      createHabit.mutate(input, { onSuccess: () => habitDialog.close() })
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl p-4 md:p-6">
        <Outlet />
      </main>

      <TaskForm
        open={taskDialog.isOpen}
        onOpenChange={(open) => {
          if (open) return
          taskDialog.close()
        }}
        onSubmit={handleTaskSubmit}
        task={taskDialog.editingTask}
        defaultDueDate={taskDialog.defaultDueDate ?? undefined}
        isPending={createTask.isPending || updateTask.isPending}
      />

      <HabitForm
        open={habitDialog.isOpen}
        onOpenChange={(open) => {
          if (open) return
          habitDialog.close()
        }}
        onSubmit={handleHabitSubmit}
        habit={habitDialog.editingHabit}
        isPending={createHabit.isPending || updateHabit.isPending}
      />
    </div>
  )
}
