import { NavLink } from "react-router-dom"
import { CheckSquare, Calendar, Home, Repeat, StickyNote } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { NavbarLogo } from "./navbar-logo"
import { NavbarActions } from "./navbar-actions"
import { NavbarMobile } from "./navbar-mobile"

const navLinks = [
  { label: "Workspace", path: "/", icon: Home },
  { label: "Tasks", path: "/tasks", icon: CheckSquare },
  { label: "Habits", path: "/habits", icon: Repeat },
  { label: "Calendar", path: "/calendar", icon: Calendar },
  { label: "Notes", path: "/notes", icon: StickyNote },
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-border bg-secondary-background shadow-shadow">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-14 items-center justify-between gap-4 px-4"
      >
        <div className="flex items-center gap-4">
          <NavbarMobile />
          <NavbarLogo />
        </div>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                end={link.path === "/"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 rounded-base px-3 py-1.5 text-sm font-medium transition-all border-2 border-transparent",
                    isActive
                      ? "bg-main text-main-foreground border-border shadow-shadow -translate-x-[1px] -translate-y-[1px] shadow-none"
                      : "text-foreground hover:bg-secondary hover:border-border",
                  )
                }
              >
                <link.icon className="size-4" />
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <NavbarActions />
      </nav>
    </header>
  )
}
