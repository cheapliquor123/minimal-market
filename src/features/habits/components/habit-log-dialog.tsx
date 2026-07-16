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
import { useHabits } from "../hooks/use-habits"
import type { Habit } from "../types"

interface HabitLogDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  logDate: string | null
  onSubmit: (habitId: string, date: string, value: number) => void
  isPending?: boolean
}

const typeConfig = {
  binary: { icon: Check, label: "Daily", defaultLabel: "Done" },
  numerical: { icon: Hash, label: "Count", defaultLabel: "Log +1" },
  time: { icon: Clock, label: "Timer", defaultLabel: "Log 1 min" },
}

export function HabitLogDialog({
  open,
  onOpenChange,
  logDate,
  onSubmit,
  isPending,
}: HabitLogDialogProps) {
  const { data: habits = [] } = useHabits()
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null)
  const [value, setValue] = useState("")

  function handleSubmit() {
    if (!selectedHabit || !logDate) return

    let logValue: number
    if (selectedHabit.type === "binary") {
      logValue = 1
    } else {
      const parsed = Number(value)
      if (!parsed || parsed <= 0) return
      logValue = parsed
    }

    onSubmit(selectedHabit.id, logDate, logValue)
    setSelectedHabit(null)
    setValue("")
    onOpenChange(false)
  }

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      setSelectedHabit(null)
      setValue("")
    }
    onOpenChange(isOpen)
  }

  const needsValue = !!(selectedHabit && selectedHabit.type !== "binary")

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log Habit</DialogTitle>
          {logDate && (
            <p className="text-xs text-muted-foreground">{logDate}</p>
          )}
        </DialogHeader>

        {habits.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No habits yet. Create a habit first.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-heading">Select Habit</span>
              <div className="flex flex-wrap gap-1.5">
                {habits.map((h) => {
                  const cfg = typeConfig[h.type]
                  return (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => {
                        setSelectedHabit(h)
                        setValue("")
                      }}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-base border-2 px-2.5 py-1 text-xs font-heading transition-all",
                        selectedHabit?.id === h.id
                          ? "border-border shadow-shadow -translate-x-[1px] -translate-y-[1px]"
                          : "border-border shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-shadow",
                      )}
                    >
                      <span
                        className="size-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: h.color }}
                      />
                      {h.name}
                      <cfg.icon className="size-3 text-muted-foreground" />
                    </button>
                  )
                })}
              </div>
            </div>

            {needsValue && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="log-value" className="text-xs font-heading">
                  {selectedHabit.type === "time" ? "Minutes" : "Count"}
                </label>
                <Input
                  id="log-value"
                  type="number"
                  min="1"
                  placeholder={selectedHabit.type === "time" ? "30" : "1"}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  autoFocus
                />
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!selectedHabit || isPending || (needsValue && (!value || Number(value) <= 0))}
            onClick={handleSubmit}
            className="bg-main text-main-foreground border-2 border-border shadow-shadow hover:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px]"
          >
            {selectedHabit ? typeConfig[selectedHabit.type].defaultLabel : "Log"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
