import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { cn } from "@/shared/lib/utils"
import { CATEGORY_COLORS } from "../types"
import type { Category } from "../types"

interface CategoryPickerProps {
  value: string
  categories: Category[]
  onChange: (name: string) => void
  onCreateCategory: (name: string, color: string) => void
  isCreatingPending: boolean
}

export function CategoryPicker({
  value,
  categories,
  onChange,
  onCreateCategory,
  isCreatingPending,
}: CategoryPickerProps) {
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState("")
  const [newColor, setNewColor] = useState<string>(CATEGORY_COLORS[0].value)

  function handleCreate() {
    if (!newName.trim()) return
    onCreateCategory(newName.trim(), newColor)
    setNewName("")
    setNewColor(CATEGORY_COLORS[0].value)
    setCreating(false)
  }

  function handleCancel() {
    setCreating(false)
    setNewName("")
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
                handleCancel()
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
                onClick={handleCancel}
              >
                <X className="size-3" />
              </Button>
              <Button
                type="button"
                size="xs"
                onClick={handleCreate}
                disabled={!newName.trim() || isCreatingPending}
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
