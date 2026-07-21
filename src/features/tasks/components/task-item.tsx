import { MoreHorizontal, Pencil, Trash2, Repeat } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Checkbox } from "@/shared/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import type { Task } from "../types"
import { cn } from "@/shared/lib/utils"

interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

const priorityConfig = {
  high: { label: "High", variant: "destructive" as const },
  medium: { label: "Med", variant: "warning" as const },
  low: { label: "Low", variant: "info" as const },
}

function toStartOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function formatDueDate(dueDate: string): { label: string; isOverdue: boolean; isToday: boolean } {
  const today = toStartOfDay(new Date())
  const due = new Date(dueDate + "T00:00:00")
  const diff = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diff < 0) return { label: `${Math.abs(diff)}d overdue`, isOverdue: true, isToday: false }
  if (diff === 0) return { label: "Today", isOverdue: false, isToday: true }
  if (diff === 1) return { label: "Tomorrow", isOverdue: false, isToday: false }
  return { label: `In ${diff}d`, isOverdue: false, isToday: false }
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const priority = priorityConfig[task.priority]
  const due = task.dueDate ? formatDueDate(task.dueDate) : null

  function handleClick() {
    const selection = window.getSelection()
    if (selection && selection.toString().length > 0) return
    onEdit(task)
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "group flex items-center gap-3 rounded-base border-2 border-border bg-secondary-background p-3 shadow-shadow transition-all select-text",
        "hover:-translate-y-[1px] hover:shadow-none",
        task.completed && "opacity-60",
      )}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
        />
      </div>

      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <span
          className={cn(
            "text-sm font-medium leading-none truncate",
            task.completed && "line-through text-muted-foreground",
          )}
        >
          {task.title}
        </span>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {due && (
            <span
              className={cn(
                due.isOverdue && "text-destructive font-medium",
                due.isToday && "text-warning font-medium",
              )}
            >
              {due.label}
            </span>
          )}
          {task.carryForward && task.missedCount > 0 && (
            <Badge variant="warning" className="text-[10px]">
              Missed {task.missedCount}x
            </Badge>
          )}
          {task.carryForward && task.missedCount === 0 && (
            <Repeat className="size-3 text-muted-foreground" />
          )}
          {task.category && (
            <>
              {due && <span>·</span>}
              <span>{task.category}</span>
            </>
          )}
        </div>
      </div>

      <Badge variant={priority.variant} className="hidden sm:inline-flex">
        {priority.label}
      </Badge>

      <div onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-xs"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Task actions"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <Pencil className="size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(task.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
