import { UserDropdown } from "./user-dropdown"

export function NavbarActions() {
  return (
    <div className="flex items-center gap-1">
      <UserDropdown />
    </div>
  )
}
