import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input, Textarea } from "@/shared/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { NoteColorPicker } from "./note-color-picker"
import type { Note } from "../types"

interface NoteFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { title: string; content: string; color: string | null; pinned: boolean }) => void
  onDelete: (id: string) => void
  note: Note | null
  isPending?: boolean
}

function NoteFormInner({
  note,
  onSubmit,
  onDelete,
  onOpenChange,
  isPending,
}: {
  note: Note | null
  onSubmit: NoteFormProps["onSubmit"]
  onDelete: (id: string) => void
  onOpenChange: (open: boolean) => void
  isPending?: boolean
}) {
  const [title, setTitle] = useState(note?.title ?? "")
  const [content, setContent] = useState(note?.content ?? "")
  const [color, setColor] = useState<string | null>(note?.color ?? null)
  const [pinned, setPinned] = useState(note?.pinned ?? false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({ title: title.trim(), content: content.trim(), color, pinned })
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{note ? "Edit note" : "New note"}</DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-4 py-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="note-title" className="text-xs font-heading">Title</label>
          <Input
            id="note-title"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="note-content" className="text-xs font-heading">Content</label>
          <Textarea
            id="note-content"
            placeholder="Write something..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            className="resize-none"
          />
        </div>

        <NoteColorPicker value={color} onChange={setColor} />

        <button
          type="button"
          onClick={() => setPinned(!pinned)}
          className="flex items-center gap-2 text-xs font-heading w-fit"
        >
          <span
            className={`size-4 rounded border-2 border-border flex items-center justify-center transition-all ${
              pinned ? "bg-main border-main" : "bg-background"
            }`}
          >
            {pinned && <span className="size-2 rounded-sm bg-main-foreground" />}
          </span>
          {pinned ? "Pinned" : "Pin to top"}
        </button>
      </div>

      <DialogFooter>
        {note && (
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              onDelete(note.id)
              onOpenChange(false)
            }}
            className="mr-auto"
          >
            <Trash2 className="size-3.5" />
            Delete
          </Button>
        )}
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
          {note ? "Save" : "Create"}
        </Button>
      </DialogFooter>
    </form>
  )
}

export function NoteForm({ open, onOpenChange, onSubmit, onDelete, note, isPending }: NoteFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {open && (
          <NoteFormInner
            key={note?.id ?? "new"}
            note={note}
            onSubmit={onSubmit}
            onDelete={onDelete}
            onOpenChange={onOpenChange}
            isPending={isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
