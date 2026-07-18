import type { TaskPriority, TaskFilters } from "./types"

export const priorityConfig = {
  high: { label: "High", variant: "destructive" as const },
  medium: { label: "Med", variant: "warning" as const },
  low: { label: "Low", variant: "info" as const },
}

export const priorities: { value: TaskPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Med" },
  { value: "high", label: "High" },
]

export const priorityColors: Record<TaskPriority, string> = {
  low: "bg-info text-info-foreground border-border",
  medium: "bg-secondary text-secondary-foreground border-border",
  high: "bg-destructive text-destructive-foreground border-border",
}

export const priorityActiveColors: Record<TaskPriority, string> = {
  low: "bg-info text-info-foreground border-border shadow-shadow",
  medium: "bg-secondary text-secondary-foreground border-border shadow-shadow",
  high: "bg-destructive text-destructive-foreground border-border shadow-shadow",
}

export const statusFilterOptions: { value: TaskFilters["status"]; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Done" },
]

export const priorityFilterOptions: { value: TaskFilters["priority"]; label: string }[] = [
  { value: "all", label: "All" },
  { value: "high", label: "High" },
  { value: "medium", label: "Med" },
  { value: "low", label: "Low" },
]

export function toStartOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function formatDueDate(dueDate: string): { label: string; isOverdue: boolean; isToday: boolean } {
  const today = toStartOfDay(new Date())
  const due = new Date(dueDate + "T00:00:00")
  const diff = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diff < 0) return { label: `${Math.abs(diff)}d overdue`, isOverdue: true, isToday: false }
  if (diff === 0) return { label: "Today", isOverdue: false, isToday: true }
  if (diff === 1) return { label: "Tomorrow", isOverdue: false, isToday: false }
  return { label: `In ${diff}d`, isOverdue: false, isToday: false }
}

export function hasActiveFilters(filters?: TaskFilters): boolean {
  return !!(filters?.search || (filters?.priority && filters.priority !== "all"))
}
