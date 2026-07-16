import { Search } from "lucide-react"
import { Input } from "@/shared/components/ui/input"
import { cn } from "@/shared/lib/utils"
import type { TaskFilters, TaskStatus, TaskPriority } from "../types"

interface TaskFiltersProps {
  filters: TaskFilters
  onChange: (filters: TaskFilters) => void
}

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Done" },
]

const priorityOptions: { value: TaskPriority | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "high", label: "High" },
  { value: "medium", label: "Med" },
  { value: "low", label: "Low" },
]

export function TaskFilters({ filters, onChange }: TaskFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex gap-1">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange({ ...filters, status: opt.value })}
            className={cn(
              "rounded-base border-2 border-border px-3 py-1 text-xs font-heading transition-all",
              filters.status === opt.value
                ? "bg-main text-main-foreground shadow-shadow"
                : "bg-secondary-background text-foreground shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-shadow",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground hidden sm:inline">Priority:</span>
        <div className="flex gap-1">
          {priorityOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ ...filters, priority: opt.value })}
              className={cn(
                "rounded-base border-2 border-border px-2 py-1 text-xs font-heading transition-all",
                filters.priority === opt.value
                  ? "bg-secondary text-secondary-foreground shadow-shadow"
                  : "bg-secondary-background text-foreground shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-shadow",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative flex-1 min-w-[160px]">
        <Search className="absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={filters.search ?? ""}
          onChange={(e) => onChange({ ...filters, search: e.target.value || undefined })}
          className="pl-7 h-8 text-xs"
        />
      </div>
    </div>
  )
}
