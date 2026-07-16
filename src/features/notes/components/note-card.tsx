import { Pin, Trash2 } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { getNoteStyle } from "@/shared/lib/note-colors"
import type { Note } from "../types"

interface NoteCardProps {
  note: Note
  onClick: (note: Note) => void
  onDelete: (id: string) => void
}

export function NoteCard({ note, onClick, onDelete }: NoteCardProps) {
  return (
    <div
      className={cn(
        "group relative w-full break-inside-avoid rounded-base border-2 border-border p-4 text-left transition-all",
        "hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-shadow",
        !note.color && "bg-secondary-background",
      )}
      style={getNoteStyle(note.color)}
    >
      <button
        type="button"
        onClick={() => onClick(note)}
        className="w-full"
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading text-sm leading-tight line-clamp-2 flex-1">
            {note.title}
          </h3>
          {note.pinned && (
            <Pin className="size-3.5 shrink-0 fill-current text-main" />
          )}
        </div>

        {note.content && (
          <p className="mt-1.5 text-xs text-muted-foreground whitespace-pre-wrap line-clamp-6">
            {note.content}
          </p>
        )}
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onDelete(note.id)
        }}
        className="absolute bottom-2 right-2 size-7 items-center justify-center rounded-base border-2 border-border bg-background opacity-0 transition-all hover:bg-destructive hover:text-destructive-foreground hover:border-destructive group-hover:flex hidden"
        title="Delete note"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  )
}
