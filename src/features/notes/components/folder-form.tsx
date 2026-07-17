import { useState, useMemo } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { NoteColorPicker } from "./note-color-picker"
import type { Folder } from "../types"

interface FolderFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { name: string; color: string | null }) => void
  onDelete: (id: string) => void
  folder: Folder | null
  isPending?: boolean
}

function FolderFormInner({
  folder,
  onSubmit,
  onDelete,
  onOpenChange,
  isPending,
}: {
  folder: Folder | null
  onSubmit: FolderFormProps["onSubmit"]
  onDelete: (id: string) => void
  onOpenChange: (open: boolean) => void
  isPending?: boolean
}) {
  const [name, setName] = useState(folder?.name ?? "")
  const [color, setColor] = useState<string | null>(folder?.color ?? null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({ name: name.trim(), color })
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{folder ? "Edit folder" : "New folder"}</DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-4 py-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="folder-name" className="text-xs font-heading">Name</label>
          <Input
            id="folder-name"
            placeholder="Folder name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>

        <NoteColorPicker value={color} onChange={setColor} />
      </div>

      <DialogFooter>
        {folder && (
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              onDelete(folder.id)
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
          disabled={!name.trim() || isPending}
          className="bg-main text-main-foreground border-2 border-border shadow-shadow hover:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px]"
        >
          {folder ? "Save" : "Create"}
        </Button>
      </DialogFooter>
    </form>
  )
}

export function FolderForm({ open, onOpenChange, onSubmit, onDelete, folder, isPending }: FolderFormProps) {
  const formKey = useMemo(
    () => `${folder?.id ?? "new"}-${open}`,
    [folder?.id, open],
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <FolderFormInner
          key={formKey}
          folder={folder}
          onSubmit={onSubmit}
          onDelete={onDelete}
          onOpenChange={onOpenChange}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  )
}
