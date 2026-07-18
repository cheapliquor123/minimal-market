import { useEffect } from "react"
import { Outlet, Navigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { Show } from "@clerk/react-router"
import { ClerkProvider } from "@clerk/react-router"
import { shadcn } from "@clerk/ui/themes"
import { Navbar } from "@/shared/components/layout/navbar"
import { TaskForm } from "@/features/tasks/components/task-form"
import { HabitForm } from "@/features/habits/components/habit-form"
import { useCreateTask, useUpdateTask } from "@/features/tasks/hooks/use-tasks"
import { useCreateHabit, useUpdateHabit } from "@/features/habits/hooks/use-habits"
import { useEntityFormSubmit } from "@/shared/hooks/use-entity-form-submit"
import { useTaskDialogStore } from "@/stores/task-dialog-store"
import { useHabitDialogStore } from "@/stores/habit-dialog-store"
import { startTodayRefresh, stopTodayRefresh } from "@/stores/date-store"
import { activeTasksApi } from "@/features/tasks/api/api-switch"
import { AuthTokenProvider } from "@/shared/components/auth/auth-token-provider"
import type { CreateTaskInput } from "@/features/tasks/types"
import type { CreateHabitInput } from "@/features/habits/types"

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env.development file")
}

export function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{ theme: shadcn }}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
    >
      <AuthTokenProvider>
        <Show when="signed-in">
          <AuthenticatedLayout />
        </Show>
        <Show when="signed-out">
          <Navigate to="/sign-in" replace />
        </Show>
      </AuthTokenProvider>
    </ClerkProvider>
  )
}

function AuthenticatedLayout() {
  const editingTask = useTaskDialogStore((s) => s.editingTask)
  const taskDialogClose = useTaskDialogStore((s) => s.close)
  const editingHabit = useHabitDialogStore((s) => s.editingHabit)
  const habitDialogClose = useHabitDialogStore((s) => s.close)
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

  const { handleSubmit: handleTaskSubmit, isPending: taskPending } = useEntityFormSubmit({
    editing: editingTask,
    create: createTask,
    update: updateTask,
    onSuccess: taskDialogClose,
  })

  const { handleSubmit: handleHabitSubmit, isPending: habitPending } = useEntityFormSubmit({
    editing: editingHabit,
    create: createHabit,
    update: updateHabit,
    onSuccess: habitDialogClose,
  })

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl p-4 md:p-6">
        <Outlet />
      </main>

      <TaskFormWrapper
        onSubmit={handleTaskSubmit}
        isPending={taskPending}
      />

      <HabitFormWrapper
        onSubmit={handleHabitSubmit}
        isPending={habitPending}
      />
    </div>
  )
}

function TaskFormWrapper({
  onSubmit,
  isPending,
}: {
  onSubmit: (input: CreateTaskInput) => void
  isPending: boolean
}) {
  const open = useTaskDialogStore((s) => s.isOpen)
  const editingTask = useTaskDialogStore((s) => s.editingTask)
  const defaultDueDate = useTaskDialogStore((s) => s.defaultDueDate)
  const close = useTaskDialogStore((s) => s.close)

  return (
    <TaskForm
      open={open}
      onOpenChange={(isOpen) => { if (!isOpen) close() }}
      onSubmit={onSubmit}
      task={editingTask}
      defaultDueDate={defaultDueDate ?? undefined}
      isPending={isPending}
    />
  )
}

function HabitFormWrapper({
  onSubmit,
  isPending,
}: {
  onSubmit: (input: CreateHabitInput) => void
  isPending: boolean
}) {
  const open = useHabitDialogStore((s) => s.isOpen)
  const editingHabit = useHabitDialogStore((s) => s.editingHabit)
  const close = useHabitDialogStore((s) => s.close)

  return (
    <HabitForm
      open={open}
      onOpenChange={(isOpen) => { if (!isOpen) close() }}
      onSubmit={onSubmit}
      habit={editingHabit}
      isPending={isPending}
    />
  )
}
