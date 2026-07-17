import { lazy } from "react"

export const WorkspacePage = lazy(() =>
  import("@/features/workspace").then((m) => ({ default: m.WorkspacePage })),
)
export const TasksPage = lazy(() =>
  import("@/features/tasks").then((m) => ({ default: m.TasksPage })),
)
export const HabitsPage = lazy(() =>
  import("@/features/habits").then((m) => ({ default: m.HabitsPage })),
)
export const CalendarPage = lazy(() =>
  import("@/features/calendar").then((m) => ({ default: m.CalendarPage })),
)
export const NotesPage = lazy(() =>
  import("@/features/notes").then((m) => ({ default: m.NotesPage })),
)
