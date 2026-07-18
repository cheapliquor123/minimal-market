import type { LucideIcon } from "lucide-react"
import { Button } from "@/shared/components/ui/button"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-base border-2 border-dashed border-border py-12 text-center">
      <Icon className="size-10 text-muted-foreground" />
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
      {action && (
        <Button
          size="sm"
          onClick={action.onClick}
          className="mt-1 bg-main text-main-foreground border-2 border-border shadow-shadow hover:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px]"
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}
