import * as React from "react"

import { cn } from "@/shared/lib/utils"

function Input({
  className,
  type = "text",
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-9 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-1 text-sm shadow-shadow transition-all",
        "placeholder:text-muted-foreground",
        "focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "[&:user-invalid]:border-destructive [&:user-invalid]:shadow-destructive/20",
        className,
      )}
      {...props}
    />
  )
}

function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[60px] w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm shadow-shadow transition-all",
        "placeholder:text-muted-foreground",
        "focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}

export { Input, Textarea }
