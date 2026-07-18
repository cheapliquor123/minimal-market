import { useNoteDialogStore } from "@/stores/note-dialog-store"
import { useFolderDialogStore } from "@/stores/folder-dialog-store"
import { useDeleteConfirmation } from "@/shared/hooks/use-delete-confirmation"

export function useNotesDialogs() {
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

  const noteDelete = useDeleteConfirmation()
  const folderDelete = useDeleteConfirmation()

  return {
    currentFolderId,
    setCurrentFolder,

    openNoteCreate,
    openNoteEdit,
    noteDialogOpen,
    editingNote,
    closeNoteDialog,

    openFolderCreate,
    openFolderEdit,
    folderDialogOpen,
    editingFolder,
    closeFolderDialog,

    noteDelete,
    folderDelete,
  }
}
