import { Folder, Pencil, Trash2 } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { getNoteStyle } from "@/shared/lib/note-colors"
import type { Folder as FolderType } from "../types"

interface FolderCardProps {
  folder: FolderType
  onClick: (folder: FolderType) => void
  onEdit: (folder: FolderType) => void
  onDelete: (id: string) => void
}

export function FolderCard({
  folder,
  onClick,
  onEdit,
  onDelete,
}: FolderCardProps) {
  return (
    <div
      className={cn(
        "group relative w-full rounded-base border-2 border-border p-4 text-left transition-all cursor-pointer",
        "hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-shadow",
        !folder.color && "bg-secondary-background",
      )}
      style={getNoteStyle(folder.color)}
    >
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onClick(folder)}
          className="flex flex-1 items-center gap-3 min-w-0"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-base border-2 border-border bg-background">
            <Folder className="size-4" />
          </div>
          <h3 className="font-heading text-sm leading-tight line-clamp-1 min-w-0">
            {folder.name}
          </h3>
        </button>

        <div className="flex items-center gap-1 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(folder)
            }}
            className="flex size-7 items-center justify-center rounded-base border-2 border-border bg-background transition-all"
            title="Edit folder"
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(folder.id)
            }}
            className="flex size-7 items-center justify-center rounded-base border-2 border-border bg-background transition-all hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
            title="Delete folder"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
