import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"

interface FormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  formKey: string
  className?: string
  children: React.ReactNode
}

export function FormDialog({
  open,
  onOpenChange,
  title,
  formKey,
  className,
  children,
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {open && (
          <div key={formKey}>
            {children}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
