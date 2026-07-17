import { ChevronLeft } from "lucide-react"

interface FolderBreadcrumbProps {
  folderName: string
  onBack: () => void
}

export function FolderBreadcrumb({ folderName, onBack }: FolderBreadcrumbProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="size-4" />
        Notes
      </button>
      <span className="text-muted-foreground">/</span>
      <span className="font-heading">{folderName}</span>
    </div>
  )
}
