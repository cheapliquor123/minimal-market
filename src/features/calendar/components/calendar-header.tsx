import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { cn } from "@/shared/lib/utils"
import type { ViewMode } from "../utils"

interface CalendarHeaderProps {
  title: string
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  onPrev: () => void
  onNext: () => void
  onToday: () => void
}

const viewOptions: { value: ViewMode; label: string }[] = [
  { value: "month", label: "Month" },
  { value: "week", label: "Week" },
  { value: "day", label: "Day" },
]

export function CalendarHeader({
  title,
  viewMode,
  onViewModeChange,
  onPrev,
  onNext,
  onToday,
}: CalendarHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onPrev}
          className="border-2 border-border"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <h2 className="font-heading text-lg min-w-[200px] text-center">{title}</h2>
        <Button
          variant="outline"
          size="icon"
          onClick={onNext}
          className="border-2 border-border"
        >
          <ChevronRight className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
          className="border-2 border-border"
        >
          <CalendarDays className="size-3.5" />
          Today
        </Button>
      </div>

      <div className="flex gap-1">
        {viewOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onViewModeChange(opt.value)}
            className={cn(
              "rounded-base border-2 border-border px-3 py-1 text-xs font-heading transition-all",
              viewMode === opt.value
                ? "bg-main text-main-foreground shadow-shadow"
                : "bg-secondary-background text-foreground shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-shadow",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
