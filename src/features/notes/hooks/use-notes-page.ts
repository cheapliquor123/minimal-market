import { useMemo } from "react"
import {
  useNotes,
  useCreateNote,
  useUpdateNote,
  useDeleteNote,
} from "./use-notes"
import {
  useFolders,
  useCreateFolder,
  useUpdateFolder,
  useDeleteFolder,
} from "./use-folders"
import { useNotesFilters } from "./use-notes-filters"
import { useNotesDialogs } from "./use-notes-dialogs"

export function useNotesPage() {
  const filters = useNotesFilters()
  const dialogs = useNotesDialogs()

  const { data: allNotes = [], isLoading: notesLoading, error: notesError } = useNotes(
    dialogs.currentFolderId,
    filters.debouncedSearch || undefined,
  )
  const { data: allFolders = [], isLoading: foldersLoading, error: foldersError } = useFolders()

  const createNote = useCreateNote()
  const updateNote = useUpdateNote()
  const deleteNote = useDeleteNote()

  const createFolder = useCreateFolder()
  const updateFolder = useUpdateFolder()
  const deleteFolder = useDeleteFolder()

  const notes = useMemo(() => {
    if (!filters.colorFilter) return allNotes
    return allNotes.filter((n) => n.color === filters.colorFilter)
  }, [allNotes, filters.colorFilter])

  const currentFolder = useMemo(
    () => allFolders.find((f) => f.id === dialogs.currentFolderId) ?? null,
    [allFolders, dialogs.currentFolderId],
  )

  function handleNoteSubmit(data: {
    title: string
    content: string
    color: string | null
    pinned: boolean
  }) {
    if (dialogs.editingNote) {
      updateNote.mutate(
        { id: dialogs.editingNote.id, input: data },
        { onSuccess: () => dialogs.closeNoteDialog() },
      )
    } else {
      createNote.mutate(
        { ...data, folderId: dialogs.currentFolderId },
        { onSuccess: () => dialogs.closeNoteDialog() },
      )
    }
  }

  function handleFolderSubmit(data: { name: string; color: string | null }) {
    if (dialogs.editingFolder) {
      updateFolder.mutate(
        { id: dialogs.editingFolder.id, input: data },
        { onSuccess: () => dialogs.closeFolderDialog() },
      )
    } else {
      createFolder.mutate(data, { onSuccess: () => dialogs.closeFolderDialog() })
    }
  }

  return {
    ...filters,
    ...dialogs,

    notes,
    allFolders,
    currentFolder,
    notesLoading,
    foldersLoading,
    notesError: notesError?.message ?? null,
    foldersError: foldersError?.message ?? null,

    createNote,
    updateNote,
    deleteNote,
    createFolder,
    updateFolder,
    deleteFolder,

    handleNoteSubmit,
    handleFolderSubmit,
  }
}
