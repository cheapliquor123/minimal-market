import { useState, useMemo } from "react"
import { PageHeader } from "@/shared/components/layout/page-header"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog"
import { useNotes, useCreateNote, useUpdateNote, useDeleteNote } from "./hooks/use-notes"
import { NoteGrid } from "./components/note-grid"
import { NoteForm } from "./components/note-form"
import { useNoteDialogStore } from "@/stores/note-dialog-store"

export function NotesPage() {
  const openCreate = useNoteDialogStore((s) => s.openCreate)
  const openEdit = useNoteDialogStore((s) => s.openEdit)
  const dialogOpen = useNoteDialogStore((s) => s.isOpen)
  const editingNote = useNoteDialogStore((s) => s.editingNote)
  const closeDialog = useNoteDialogStore((s) => s.close)

  const [search, setSearch] = useState("")
  const [colorFilter, setColorFilter] = useState<string | null>(null)
  const { data: allNotes = [], isLoading } = useNotes()

  const notes = useMemo(() => {
    let result = allNotes
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q),
      )
    }
    if (colorFilter) {
      result = result.filter((n) => n.color === colorFilter)
    }
    return result
  }, [allNotes, search, colorFilter])
  const createNote = useCreateNote()
  const updateNote = useUpdateNote()
  const deleteNote = useDeleteNote()

  const [deleteId, setDeleteId] = useState<string | null>(null)

  function handleFormSubmit(data: { title: string; content: string; color: string | null; pinned: boolean }) {
    if (editingNote) {
      updateNote.mutate(
        { id: editingNote.id, input: data },
        { onSuccess: () => closeDialog() },
      )
    } else {
      createNote.mutate(data, { onSuccess: () => closeDialog() })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Notes"
        description="Quick thoughts and reminders"
      />

      <NoteGrid
        notes={notes}
        isLoading={isLoading}
        search={search}
        onSearchChange={setSearch}
        colorFilter={colorFilter}
        onColorFilterChange={setColorFilter}
        onNoteClick={openEdit}
        onDelete={setDeleteId}
        onCreate={openCreate}
      />

      <NoteForm
        open={dialogOpen}
        onOpenChange={(open) => { if (!open) closeDialog() }}
        onSubmit={handleFormSubmit}
        onDelete={setDeleteId}
        note={editingNote}
        isPending={createNote.isPending || updateNote.isPending}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete note?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The note will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) deleteNote.mutate(deleteId)
                setDeleteId(null)
              }}
              className="bg-destructive text-destructive-foreground border-2 border-border shadow-shadow hover:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px]"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
