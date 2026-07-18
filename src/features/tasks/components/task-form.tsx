import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { Input, Textarea } from "@/shared/components/ui/input"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/shared/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { Calendar } from "@/shared/components/ui/calendar"
import { useTaskForm } from "../hooks/use-task-form"
import { CategoryPicker } from "./category-picker"
import { useCategories } from "../hooks/use-categories"
import { useCreateCategory } from "../hooks/use-categories"
import { priorities, priorityColors, priorityActiveColors } from "../utils"
import type { Task, CreateTaskInput, TaskPriority } from "../types"

interface TaskFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: CreateTaskInput) => void
  task?: Task | null
  isPending?: boolean
  defaultDueDate?: string
}

function TaskPrioritySelector({
  value,
  onChange,
}: {
  value: TaskPriority
  onChange: (p: TaskPriority) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-heading">Priority</span>
      <div className="flex gap-1">
        {priorities.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => onChange(p.value)}
            className={cn(
              "flex-1 rounded-base border-2 px-2 py-1 text-xs font-heading transition-all",
              value === p.value
                ? priorityActiveColors[p.value]
                : cn(priorityColors[p.value], "shadow-none"),
              value !== p.value &&
                "hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-shadow",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function TaskDateSection({
  value,
  onChange,
}: {
  value: Date | undefined
  onChange: (date: Date | undefined) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-heading">Due Date</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-base",
              !value && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="size-4" />
            {value ? format(value, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

function TaskCarryForwardToggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id="carry-forward"
        checked={checked}
        onCheckedChange={(c) => onChange(c ?? false)}
        disabled={disabled}
      />
      <label
        htmlFor="carry-forward"
        className={cn(
          "text-xs font-heading cursor-pointer select-none",
          disabled && "text-muted-foreground cursor-not-allowed",
        )}
      >
        Carry forward
        <span className="text-muted-foreground font-base ml-1">
          {disabled
            ? "\u2014 Set a due date first"
            : "\u2014 Move to next day if not completed"}
        </span>
      </label>
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
  const form = useTaskForm({ task, defaultDueDate })
  const { data: categories = [] } = useCategories()
  const createCategory = useCreateCategory()

  function handleCreateCategory(name: string, color: string) {
    createCategory.mutate({ name, color }, {
      onSuccess: (cat) => form.setCategory(cat.name),
    })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.isValid) return
    onSubmit(form.buildInput())
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
          value={form.title}
          onChange={(e) => form.setTitle(e.target.value)}
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
          value={form.description}
          onChange={(e) => form.setDescription(e.target.value)}
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TaskDateSection value={form.dueDate} onChange={form.setDueDate} />
        <TaskPrioritySelector value={form.priority} onChange={form.setPriority} />
      </div>

      <TaskCarryForwardToggle
        checked={form.carryForward}
        onChange={form.setCarryForward}
        disabled={!form.dueDate}
      />

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-heading">Category</span>
        <CategoryPicker
          value={form.category}
          categories={categories}
          onChange={form.setCategory}
          onCreateCategory={handleCreateCategory}
          isCreatingPending={createCategory.isPending}
        />
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
          disabled={!form.isValid || isPending}
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
