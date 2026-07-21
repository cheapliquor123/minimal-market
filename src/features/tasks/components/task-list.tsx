import { CheckCircle } from "lucide-react"
import { TaskItem } from "./task-item"
import { EmptyState } from "@/shared/components/empty-state"
import { ErrorState } from "@/shared/components/error-state"
import { TaskSkeleton } from "@/shared/components/loading-skeleton"
import type { Task, TaskFilters } from "../types"

interface TaskListProps {
  tasks: Task[]
  filters?: TaskFilters
  isLoading?: boolean
  error?: string | null
  onToggle: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onCreate?: () => void
}

function hasActiveFilters(filters?: TaskFilters): boolean {
  return !!(filters?.search || (filters?.priority && filters.priority !== "all"))
}

export function TaskList({
  tasks,
  filters,
  isLoading,
  error,
  onToggle,
  onEdit,
  onDelete,
  onCreate,
}: TaskListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <TaskSkeleton />
        <TaskSkeleton />
        <TaskSkeleton />
      </div>
    )
  }

  if (error) {
    return <ErrorState message={error} />
  }

  if (tasks.length === 0) {
    if (hasActiveFilters(filters)) {
      return (
        <EmptyState
          icon={CheckCircle}
          title="No matching tasks"
          description="Try adjusting your filters or search query."
        />
      )
    }

    return (
      <EmptyState
        icon={CheckCircle}
        title="No tasks yet"
        description="Create your first task to get started."
        action={onCreate ? { label: "Create task", onClick: onCreate } : undefined}
      />
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
