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
import {
  useNotes,
  useCreateNote,
  useUpdateNote,
  useDeleteNote,
} from "./hooks/use-notes"
import {
  useFolders,
  useCreateFolder,
  useUpdateFolder,
  useDeleteFolder,
} from "./hooks/use-folders"
import { NoteGrid } from "./components/note-grid"
import { NoteForm } from "./components/note-form"
import { FolderForm } from "./components/folder-form"
import { FolderBreadcrumb } from "./components/folder-breadcrumb"
import { useNoteDialogStore } from "@/stores/note-dialog-store"
import { useFolderDialogStore } from "@/stores/folder-dialog-store"
import { useDebounce } from "@/shared/hooks/use-debounce"

export function NotesPage() {
  const currentFolderId = useNoteDialogStore((s) => s.currentFolderId)
  const setCurrentFolder = useNoteDialogStore((s) => s.setCurrentFolder)

  const openNoteCreate = useNoteDialogStore((s) => s.openCreate)
  const openNoteEdit = useNoteDialogStore((s) => s.openEdit)
  const noteDialogOpen = useNoteDialogStore((s) => s.isOpen)
  const editingNote = useNoteDialogStore((s) => s.editingNote)
  const closeNoteDialog = useNoteDialogStore((s) => s.close)

  const openFolderCreate = useFolderDialogStore((s) => s.openCreate)
  const openFolderEdit = useFolderDialogStore((s) => s.openEdit)
  const folderDialogOpen = useFolderDialogStore((s) => s.isOpen)
  const editingFolder = useFolderDialogStore((s) => s.editingFolder)
  const closeFolderDialog = useFolderDialogStore((s) => s.close)

  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 300)
  const [colorFilter, setColorFilter] = useState<string | null>(null)
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null)
  const [deleteFolderId, setDeleteFolderId] = useState<string | null>(null)

  const { data: allNotes = [], isLoading: notesLoading } = useNotes(currentFolderId, debouncedSearch || undefined)
  const { data: allFolders = [], isLoading: foldersLoading } = useFolders()

  const createNote = useCreateNote()
  const updateNote = useUpdateNote()
  const deleteNote = useDeleteNote()

  const createFolder = useCreateFolder()
  const updateFolder = useUpdateFolder()
  const deleteFolder = useDeleteFolder()

  const notes = useMemo(() => {
    if (!colorFilter) return allNotes
    return allNotes.filter((n) => n.color === colorFilter)
  }, [allNotes, colorFilter])

  const currentFolder = useMemo(
    () => allFolders.find((f) => f.id === currentFolderId) ?? null,
    [allFolders, currentFolderId],
  )

  function handleNoteSubmit(data: { title: string; content: string; color: string | null; pinned: boolean }) {
    if (editingNote) {
      updateNote.mutate(
        { id: editingNote.id, input: data },
        { onSuccess: () => closeNoteDialog() },
      )
    } else {
      createNote.mutate(
        { ...data, folderId: currentFolderId },
        { onSuccess: () => closeNoteDialog() },
      )
    }
  }

  function handleFolderSubmit(data: { name: string; color: string | null }) {
    if (editingFolder) {
      updateFolder.mutate(
        { id: editingFolder.id, input: data },
        { onSuccess: () => closeFolderDialog() },
      )
    } else {
      createFolder.mutate(data, { onSuccess: () => closeFolderDialog() })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={currentFolder?.name ?? "Notes"}
        description={currentFolder ? "Folder" : "Quick thoughts and reminders"}
      />

      {currentFolderId && currentFolder && (
        <FolderBreadcrumb
          folderName={currentFolder.name}
          onBack={() => setCurrentFolder(null)}
        />
      )}

      <NoteGrid
        notes={notes}
        folders={currentFolderId ? [] : allFolders}
        isLoading={notesLoading || foldersLoading}
        currentFolderId={currentFolderId}
        search={search}
        onSearchChange={setSearch}
        colorFilter={colorFilter}
        onColorFilterChange={setColorFilter}
        onNoteClick={openNoteEdit}
        onCreateNote={openNoteCreate}
        onFolderClick={(folder) => setCurrentFolder(folder.id)}
        onEditFolder={openFolderEdit}
        onDeleteFolder={setDeleteFolderId}
        onCreateFolder={openFolderCreate}
      />

      <NoteForm
        open={noteDialogOpen}
        onOpenChange={(open) => { if (!open) closeNoteDialog() }}
        onSubmit={handleNoteSubmit}
        onDelete={setDeleteNoteId}
        note={editingNote}
        isPending={createNote.isPending || updateNote.isPending}
      />

      <FolderForm
        open={folderDialogOpen}
        onOpenChange={(open) => { if (!open) closeFolderDialog() }}
        onSubmit={handleFolderSubmit}
        onDelete={setDeleteFolderId}
        folder={editingFolder}
        isPending={createFolder.isPending || updateFolder.isPending}
      />

      <AlertDialog open={!!deleteNoteId} onOpenChange={(open) => { if (!open) setDeleteNoteId(null) }}>
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
                if (deleteNoteId) deleteNote.mutate(deleteNoteId)
                setDeleteNoteId(null)
              }}
              className="bg-destructive text-destructive-foreground border-2 border-border shadow-shadow hover:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px]"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteFolderId} onOpenChange={(open) => { if (!open) setDeleteFolderId(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete folder?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The folder will be permanently deleted. Notes inside will not be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteFolderId) deleteFolder.mutate(deleteFolderId)
                setDeleteFolderId(null)
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
