import { Check } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { NOTE_COLORS } from "@/shared/lib/note-colors"

interface NoteColorPickerProps {
  value: string | null
  onChange: (color: string | null) => void
}

export function NoteColorPicker({ value, onChange }: NoteColorPickerProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-heading">Color</span>
      <div className="flex gap-1.5">
        {NOTE_COLORS.filter((c) => c.value !== null).map((c) => (
          <button
            key={c.label}
            type="button"
            title={c.label}
            onClick={() => onChange(c.value)}
            className={cn(
              "size-7 rounded-full border-2 border-border transition-all",
              c.value ? "" : "bg-secondary-background",
              value === c.value && "ring-2 ring-main ring-offset-2 ring-offset-background",
            )}
            style={c.value ? { backgroundColor: c.value } : undefined}
          >
            {value === c.value && (
              <Check className="size-3.5 mx-auto text-foreground" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
