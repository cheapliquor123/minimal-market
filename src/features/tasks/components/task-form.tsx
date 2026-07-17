import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, Plus, X } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input, Textarea } from "@/shared/components/ui/input"
import { Calendar } from "@/shared/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { cn } from "@/shared/lib/utils"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { useCategories, useCreateCategory } from "../hooks/use-categories"
import { CATEGORY_COLORS } from "../types"
import type { Task, CreateTaskInput, TaskPriority } from "../types"

interface TaskFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: CreateTaskInput) => void
  task?: Task | null
  isPending?: boolean
  defaultDueDate?: string
}

const priorities: { value: TaskPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Med" },
  { value: "high", label: "High" },
]

const priorityColors: Record<TaskPriority, string> = {
  low: "bg-info text-info-foreground border-border",
  medium: "bg-secondary text-secondary-foreground border-border",
  high: "bg-destructive text-destructive-foreground border-border",
}

const priorityActiveColors: Record<TaskPriority, string> = {
  low: "bg-info text-info-foreground border-border shadow-shadow",
  medium: "bg-secondary text-secondary-foreground border-border shadow-shadow",
  high: "bg-destructive text-destructive-foreground border-border shadow-shadow",
}

function CategoryPicker({
  value,
  onChange,
}: {
  value: string
  onChange: (name: string) => void
}) {
  const { data: categories = [] } = useCategories()
  const createCategory = useCreateCategory()
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState("")
  const [newColor, setNewColor] = useState<string>(CATEGORY_COLORS[0].value)

  function handleCreate() {
    if (!newName.trim()) return
    createCategory.mutate(
      { name: newName.trim(), color: newColor },
      {
        onSuccess: (cat) => {
          onChange(cat.name)
          setNewName("")
          setNewColor(CATEGORY_COLORS[0].value)
          setCreating(false)
        },
      },
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-1.5">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange(value === cat.name ? "" : cat.name)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-base border-2 px-2.5 py-1 text-xs font-heading transition-all",
              value === cat.name
                ? "border-border shadow-shadow -translate-x-[1px] -translate-y-[1px]"
                : "border-border shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-shadow",
            )}
          >
            <span
              className="size-2.5 rounded-full shrink-0"
              style={{ backgroundColor: cat.color }}
            />
            {cat.name}
            {value === cat.name && (
              <span
                className="cursor-pointer ml-0.5 hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  onChange("")
                }}
              >
                <X className="size-3" />
              </span>
            )}
          </button>
        ))}

        {!creating && (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-1 rounded-base border-2 border-dashed border-border px-2.5 py-1 text-xs font-heading text-muted-foreground transition-all hover:-translate-x-[1px] hover:-translate-y-[1px] hover:border-border hover:shadow-shadow hover:text-foreground"
          >
            <Plus className="size-3" />
            Add
          </button>
        )}
      </div>

      {creating && (
        <div className="flex flex-col gap-2 rounded-base border-2 border-border bg-background p-2.5 shadow-shadow">
          <Input
            placeholder="Category name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            autoFocus
            className="h-8 text-xs"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleCreate()
              }
              if (e.key === "Escape") {
                setCreating(false)
                setNewName("")
              }
            }}
          />
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              {CATEGORY_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  title={c.name}
                  onClick={() => setNewColor(c.value)}
                  className={cn(
                    "size-5 rounded-full border-2 transition-all",
                    newColor === c.value
                      ? "border-foreground scale-110"
                      : "border-border hover:scale-110",
                  )}
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>
            <div className="ml-auto flex gap-1">
              <Button
                type="button"
                size="xs"
                variant="ghost"
                onClick={() => {
                  setCreating(false)
                  setNewName("")
                }}
              >
                <X className="size-3" />
              </Button>
              <Button
                type="button"
                size="xs"
                onClick={handleCreate}
                disabled={!newName.trim() || createCategory.isPending}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function TaskFormInner({
  task,
  defaultDueDate,
  onSubmit,
  onOpenChange,
  isPending,
}: {
  task: Task | null
  defaultDueDate?: string
  onSubmit: (input: CreateTaskInput) => void
  onOpenChange: (open: boolean) => void
  isPending?: boolean
}) {
  const [title, setTitle] = useState(task?.title ?? "")
  const [description, setDescription] = useState(task?.description ?? "")
  const [dueDate, setDueDate] = useState<Date | undefined>(
    task?.dueDate
      ? new Date(task.dueDate + "T00:00:00")
      : defaultDueDate
        ? new Date(defaultDueDate + "T00:00:00")
        : undefined,
  )
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? "medium")
  const [category, setCategory] = useState(task?.category ?? "")
  const [carryForward, setCarryForward] = useState(task?.carryForward ?? false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate ? format(dueDate, "yyyy-MM-dd") : undefined,
      priority,
      category: category || undefined,
      carryForward,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="task-title" className="text-xs font-heading">
          Title *
        </label>
        <Input
          id="task-title"
          placeholder="What do you need to do?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="task-desc" className="text-xs font-heading">
          Description
        </label>
        <Textarea
          id="task-desc"
          placeholder="Optional details..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-heading">Due Date</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-base",
                  !dueDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="size-4" />
                {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-heading">Priority</span>
          <div className="flex gap-1">
            {priorities.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPriority(p.value)}
                className={cn(
                  "flex-1 rounded-base border-2 px-2 py-1 text-xs font-heading transition-all",
                  priority === p.value
                    ? priorityActiveColors[p.value]
                    : cn(priorityColors[p.value], "shadow-none"),
                  priority !== p.value && "hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-shadow",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="carry-forward"
          checked={carryForward}
          onCheckedChange={(checked) => setCarryForward(checked ?? false)}
          disabled={!dueDate}
        />
        <label
          htmlFor="carry-forward"
          className={cn(
            "text-xs font-heading cursor-pointer select-none",
            !dueDate && "text-muted-foreground cursor-not-allowed",
          )}
        >
          Carry forward
          <span className="text-muted-foreground font-base ml-1">
            {dueDate
              ? "\u2014 Move to next day if not completed"
              : "\u2014 Set a due date first"}
          </span>
        </label>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-heading">Category</span>
        <CategoryPicker value={category} onChange={setCategory} />
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!title.trim() || isPending}
          className="bg-main text-main-foreground border-2 border-border shadow-shadow hover:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px]"
        >
          {task ? "Save Changes" : "Add Task"}
        </Button>
      </DialogFooter>
    </form>
  )
}

export function TaskForm({
  open,
  onOpenChange,
  onSubmit,
  task,
  isPending,
  defaultDueDate,
}: TaskFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "New Task"}</DialogTitle>
        </DialogHeader>
        {open && (
          <TaskFormInner
            key={task?.id ?? defaultDueDate ?? "new"}
            task={task ?? null}
            defaultDueDate={defaultDueDate}
            onSubmit={onSubmit}
            onOpenChange={onOpenChange}
            isPending={isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
