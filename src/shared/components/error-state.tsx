import { AlertTriangle } from "lucide-react"
import { Button } from "@/shared/components/ui/button"

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-base border-2 border-border bg-secondary-background py-12 px-8 text-center shadow-shadow">
      <AlertTriangle className="size-10 text-destructive" />
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground">{message}</p>
      {onRetry && (
        <Button
          size="sm"
          onClick={onRetry}
          className="mt-1 bg-main text-main-foreground border-2 border-border shadow-shadow hover:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px]"
        >
          Retry
        </Button>
      )}
    </div>
  )
}
