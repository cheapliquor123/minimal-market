import { useState } from "react"
import { Check, Clock, Hash } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { cn } from "@/shared/lib/utils"
import { SHARED_COLORS } from "@/shared/lib/colors"
import type { Habit, CreateHabitInput, HabitType } from "../types"

interface HabitFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: CreateHabitInput) => void
  habit?: Habit | null
  isPending?: boolean
}

const HABIT_TYPE_OPTIONS: { value: HabitType; label: string; icon: typeof Check }[] = [
  { value: "binary", label: "Daily", icon: Check },
  { value: "numerical", label: "Count", icon: Hash },
  { value: "time", label: "Timer", icon: Clock },
]

function HabitFormInner({
  habit,
  onSubmit,
  onOpenChange,
  isPending,
}: {
  habit: Habit | null
  onSubmit: (input: CreateHabitInput) => void
  onOpenChange: (open: boolean) => void
  isPending?: boolean
}) {
  const [name, setName] = useState(habit?.name ?? "")
  const [type, setType] = useState<HabitType>(habit?.type ?? "binary")
  const [color, setColor] = useState(habit?.color ?? SHARED_COLORS[0].value)
  const [goal, setGoal] = useState(habit?.goal?.toString() ?? "")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    const parsedGoal = goal ? Number(goal) : undefined
    if (type !== "binary" && (!parsedGoal || parsedGoal <= 0)) return

    onSubmit({
      name: name.trim(),
      type,
      color,
      goal: parsedGoal,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="habit-name" className="text-xs font-heading">
          Name *
        </label>
        <Input
          id="habit-name"
          placeholder="e.g. Morning Meditation"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-heading">Type</span>
        <div className="flex gap-1">
          {HABIT_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setType(opt.value)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1 rounded-base border-2 px-2 py-1.5 text-xs font-heading transition-all",
                type === opt.value
                  ? "bg-main text-main-foreground border-border shadow-shadow"
                  : "bg-secondary-background text-foreground border-border shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-shadow",
              )}
            >
              <opt.icon className="size-3" />
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {type !== "binary" && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="habit-goal" className="text-xs font-heading">
            Goal ({type === "time" ? "minutes" : "count"}) *
          </label>
          <Input
            id="habit-goal"
            type="number"
            min="1"
            placeholder={type === "time" ? "30" : "8"}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            required
          />
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-heading">Color</span>
        <div className="flex gap-2">
          {SHARED_COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              title={c.name}
              onClick={() => setColor(c.value)}
              className={cn(
                "size-7 rounded-full border-2 transition-all",
                color === c.value
                  ? "border-foreground scale-110"
                  : "border-border hover:scale-110",
              )}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>
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
          disabled={!name.trim() || isPending}
          className="bg-main text-main-foreground border-2 border-border shadow-shadow hover:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px]"
        >
          {habit ? "Save Changes" : "Add Habit"}
        </Button>
      </DialogFooter>
    </form>
  )
}

export function HabitForm({
  open,
  onOpenChange,
  onSubmit,
  habit,
  isPending,
}: HabitFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{habit ? "Edit Habit" : "New Habit"}</DialogTitle>
        </DialogHeader>
        {open && (
          <HabitFormInner
            key={habit?.id ?? "new"}
            habit={habit ?? null}
            onSubmit={onSubmit}
            onOpenChange={onOpenChange}
            isPending={isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
