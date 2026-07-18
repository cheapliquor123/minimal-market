import { PageHeader } from "@/shared/components/layout/page-header"
import { ConfirmDialog } from "@/shared/components/confirm-dialog"
import { NoteGrid } from "./components/note-grid"
import { NoteForm } from "./components/note-form"
import { FolderForm } from "./components/folder-form"
import { FolderBreadcrumb } from "./components/folder-breadcrumb"
import { useNotesPage } from "./hooks/use-notes-page"

export function NotesPage() {
  const {
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

    search,
    setSearch,
    colorFilter,
    setColorFilter,
    noteDelete,
    folderDelete,

    notes,
    allFolders,
    currentFolder,
    notesLoading,
    foldersLoading,

    createNote,
    updateNote,
    deleteNote,
    createFolder,
    updateFolder,
    deleteFolder,

    handleNoteSubmit,
    handleFolderSubmit,
  } = useNotesPage()

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
        onDeleteFolder={folderDelete.confirm}
        onCreateFolder={openFolderCreate}
      />

      <NoteForm
        open={noteDialogOpen}
        onOpenChange={(open) => { if (!open) closeNoteDialog() }}
        onSubmit={handleNoteSubmit}
        onDelete={noteDelete.confirm}
        note={editingNote}
        isPending={createNote.isPending || updateNote.isPending}
      />

      <FolderForm
        open={folderDialogOpen}
        onOpenChange={(open) => { if (!open) closeFolderDialog() }}
        onSubmit={handleFolderSubmit}
        onDelete={folderDelete.confirm}
        folder={editingFolder}
        isPending={createFolder.isPending || updateFolder.isPending}
      />

      <ConfirmDialog
        open={noteDelete.isOpen}
        onCancel={noteDelete.cancel}
        onConfirm={() => {
          if (noteDelete.deleteId) deleteNote.mutate(noteDelete.deleteId)
          noteDelete.cancel()
        }}
        title="Delete note?"
        description="This action cannot be undone. The note will be permanently deleted."
      />

      <ConfirmDialog
        open={folderDelete.isOpen}
        onCancel={folderDelete.cancel}
        onConfirm={() => {
          if (folderDelete.deleteId) deleteFolder.mutate(folderDelete.deleteId)
          folderDelete.cancel()
        }}
        title="Delete folder?"
        description="This action cannot be undone. The folder will be permanently deleted. Notes inside will not be deleted."
      />
    </div>
  )
}
