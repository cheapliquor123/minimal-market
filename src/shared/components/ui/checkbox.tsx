import { Check } from "lucide-react"
import * as React from "react"

import { cn } from "@/shared/lib/utils"

interface CheckboxProps extends Omit<React.ComponentProps<"button">, "onChange"> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

function Checkbox({
  checked = false,
  onCheckedChange,
  className,
  ...props
}: CheckboxProps) {
  return (
    <button
      role="checkbox"
      type="button"
      aria-checked={checked}
      data-slot="checkbox"
      className={cn(
        "peer size-5 shrink-0 rounded-base border-2 border-border bg-secondary-background transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        checked &&
          "bg-main text-main-foreground border-border",
        className,
      )}
      onClick={() => onCheckedChange?.(!checked)}
      {...props}
    >
      {checked && <Check className="size-3.5" strokeWidth={3} />}
    </button>
  )
}

export { Checkbox }
