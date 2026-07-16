import { CheckCircle } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { TaskItem } from "./task-item"
import type { Task, TaskFilters } from "../types"

interface TaskListProps {
  tasks: Task[]
  filters?: TaskFilters
  isLoading?: boolean
  onToggle: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onCreate?: () => void
}

function EmptyState({ filters, onCreate }: { filters?: TaskFilters; onCreate?: () => void }) {
  const hasFilters =
    filters?.search || (filters?.priority && filters.priority !== "all")

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-base border-2 border-dashed border-border py-12 text-center">
      <CheckCircle className="size-10 text-muted-foreground" />
      {hasFilters ? (
        <>
          <p className="text-sm font-medium">No matching tasks</p>
          <p className="text-xs text-muted-foreground">
            Try adjusting your filters or search query.
          </p>
        </>
      ) : (
        <>
          <p className="text-sm font-medium">No tasks yet</p>
          <p className="text-xs text-muted-foreground">
            Create your first task to get started.
          </p>
          {onCreate && (
            <Button size="sm" onClick={onCreate} className="mt-1 bg-main text-main-foreground border-2 border-border shadow-shadow hover:shadow-none hover:-translate-x-[1px] hover:-translate-y-[px]">
              Create task
            </Button>
          )}
        </>
      )}
    </div>
  )
}

function TaskSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-base border-2 border-border bg-secondary-background p-3 shadow-shadow animate-pulse">
      <div className="size-5 rounded-base bg-muted" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-2/3 rounded bg-muted" />
        <div className="h-2 w-1/3 rounded bg-muted" />
      </div>
      <div className="h-5 w-10 rounded-base bg-muted" />
    </div>
  )
}

export function TaskList({
  tasks,
  filters,
  isLoading,
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

  if (tasks.length === 0) {
    return <EmptyState filters={filters} onCreate={onCreate} />
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
