import { FileText, Plus } from "lucide-react"
import { Input } from "@/shared/components/ui/input"
import { Button } from "@/shared/components/ui/button"
import { cn } from "@/shared/lib/utils"
import { NOTE_COLORS } from "@/shared/lib/note-colors"
import { NoteCard } from "./note-card"
import type { Note } from "../types"

interface NoteGridProps {
  notes: Note[]
  isLoading?: boolean
  search: string
  onSearchChange: (search: string) => void
  colorFilter: string | null
  onColorFilterChange: (color: string | null) => void
  onNoteClick: (note: Note) => void
  onDelete: (id: string) => void
  onCreate: () => void
}

function NoteSkeleton() {
  return (
    <div className="break-inside-avoid rounded-base border-2 border-border bg-secondary-background p-4 animate-pulse">
      <div className="h-4 w-2/3 rounded bg-border mb-2" />
      <div className="h-3 w-full rounded bg-border mb-1" />
      <div className="h-3 w-4/5 rounded bg-border" />
    </div>
  )
}

export function NoteGrid({
  notes,
  isLoading,
  search,
  onSearchChange,
  colorFilter,
  onColorFilterChange,
  onNoteClick,
  onDelete,
  onCreate,
}: NoteGridProps) {
  if (isLoading) {
    return (
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <NoteSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search notes..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1"
        />
        <Button onClick={onCreate} className="bg-main text-main-foreground border-2 border-border shadow-shadow hover:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px]">
          <Plus className="size-4" />
          Note
        </Button>
      </div>

      <div className="flex items-center gap-1.5">
        {NOTE_COLORS.map((c) => {
          const isActive = colorFilter === c.value
          return (
            <button
              key={c.label}
              type="button"
              title={c.label}
              onClick={() => onColorFilterChange(isActive ? null : c.value)}
              className={cn(
                "size-6 rounded-full border-2 border-border transition-all shrink-0 relative overflow-hidden",
                c.value ? "" : "bg-secondary-background",
                isActive && "ring-2 ring-main ring-offset-2 ring-offset-background scale-110",
              )}
              style={c.value ? { backgroundColor: c.value } : undefined}
            >
              {!c.value && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="h-[2px] w-full rotate-45 bg-border" />
                </span>
              )}
            </button>
          )
        })}
      </div>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-base border-2 border-border bg-secondary-background">
            <FileText className="size-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-heading text-sm">No notes yet</p>
            <p className="text-xs text-muted-foreground">
              {search || colorFilter ? "No notes match your filters." : "Create your first note to get started."}
            </p>
          </div>
          {!search && !colorFilter && (
            <Button onClick={onCreate} size="sm" className="bg-main text-main-foreground border-2 border-border shadow-shadow hover:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px]">
              <Plus className="size-3" />
              Create note
            </Button>
          )}
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} onClick={onNoteClick} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
