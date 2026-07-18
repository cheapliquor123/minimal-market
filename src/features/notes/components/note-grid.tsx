import { FileText, FolderPlus, Plus } from "lucide-react"
import { Input } from "@/shared/components/ui/input"
import { Button } from "@/shared/components/ui/button"
import { EmptyState } from "@/shared/components/empty-state"
import { NoteSkeleton, FolderSkeleton } from "@/shared/components/loading-skeleton"
import { cn } from "@/shared/lib/utils"
import { NOTE_COLORS } from "@/shared/lib/note-colors"
import { NoteCard } from "./note-card"
import { FolderCard } from "./folder-card"
import type { Note, Folder } from "../types"

interface NoteGridToolbarProps {
  search: string
  onSearchChange: (search: string) => void
  colorFilter: string | null
  onColorFilterChange: (color: string | null) => void
  currentFolderId: string | null
  onCreateFolder: () => void
  onCreateNote: () => void
}

function NoteGridToolbar({
  search,
  onSearchChange,
  colorFilter,
  onColorFilterChange,
  currentFolderId,
  onCreateFolder,
  onCreateNote,
}: NoteGridToolbarProps) {
  return (
    <>
      <div className="flex gap-2">
        <Input
          placeholder="Search notes..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1"
        />
        {!currentFolderId && (
          <Button
            onClick={onCreateFolder}
            className="bg-main text-main-foreground border-2 border-border shadow-shadow hover:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px]"
          >
            <FolderPlus className="size-4" />
            Folder
          </Button>
        )}
        <Button
          onClick={onCreateNote}
          className="bg-main text-main-foreground border-2 border-border shadow-shadow hover:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px]"
        >
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
    </>
  )
}

interface NoteGridProps {
  notes: Note[]
  folders: Folder[]
  isLoading?: boolean
  currentFolderId: string | null
  search: string
  onSearchChange: (search: string) => void
  colorFilter: string | null
  onColorFilterChange: (color: string | null) => void
  onNoteClick: (note: Note) => void
  onCreateNote: () => void
  onFolderClick: (folder: Folder) => void
  onEditFolder: (folder: Folder) => void
  onDeleteFolder: (id: string) => void
  onCreateFolder: () => void
}

export function NoteGrid({
  notes,
  folders,
  isLoading,
  currentFolderId,
  search,
  onSearchChange,
  colorFilter,
  onColorFilterChange,
  onNoteClick,
  onCreateNote,
  onFolderClick,
  onEditFolder,
  onDeleteFolder,
  onCreateFolder,
}: NoteGridProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <FolderSkeleton key={`folder-skeleton-${i}`} />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <NoteSkeleton key={`note-skeleton-${i}`} />
          ))}
        </div>
      </div>
    )
  }

  const isEmpty = folders.length === 0 && notes.length === 0

  return (
    <div className="flex flex-col gap-4">
      <NoteGridToolbar
        search={search}
        onSearchChange={onSearchChange}
        colorFilter={colorFilter}
        onColorFilterChange={onColorFilterChange}
        currentFolderId={currentFolderId}
        onCreateFolder={onCreateFolder}
        onCreateNote={onCreateNote}
      />

      {isEmpty ? (
        <EmptyState
          icon={FileText}
          title={search || colorFilter ? "No matching notes" : "No notes yet"}
          description={
            search || colorFilter
              ? "No notes match your filters."
              : "Create your first note or folder to get started."
          }
          action={
            !search && !colorFilter
              ? {
                  label: "Create note",
                  onClick: onCreateNote,
                }
              : undefined
          }
        />
      ) : (
        <>
          {!currentFolderId && folders.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {folders.map((folder) => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  onClick={onFolderClick}
                  onEdit={onEditFolder}
                  onDelete={onDeleteFolder}
                />
              ))}
            </div>
          )}

          {notes.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onClick={onNoteClick}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
