import { Pin } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { getNoteStyle } from "@/shared/lib/note-colors"
import type { Note } from "../types"

interface NoteCardProps {
  note: Note
  onClick: (note: Note) => void
}

export function NoteCard({ note, onClick }: NoteCardProps) {
  function handleClick() {
    const selection = window.getSelection()
    if (selection && selection.toString().length > 0) return
    onClick(note)
  }

  return (
    <div
      className={cn(
        "group relative w-full rounded-base border-2 border-border p-4 text-left transition-all select-text",
        "hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-shadow",
        !note.color && "bg-secondary-background",
      )}
      style={getNoteStyle(note.color)}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-heading text-sm leading-tight line-clamp-2 flex-1 select-text">
          {note.title}
        </h3>
        {note.pinned && (
          <Pin className="size-3.5 shrink-0 fill-current text-main" />
        )}
      </div>

      {note.content && (
        <p className="mt-1.5 text-xs text-muted-foreground whitespace-pre-wrap line-clamp-6 select-text">
          {note.content}
        </p>
      )}
    </div>
  )
}
