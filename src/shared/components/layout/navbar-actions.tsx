import { PanelLeft, Bell } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { UserDropdown } from "./user-dropdown"

export function NavbarActions() {
  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" aria-label="Toggle sidebar">
        <PanelLeft className="size-4" />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
        <Bell className="size-4" />
        <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-main" />
      </Button>
      <UserDropdown />
    </div>
  )
}
