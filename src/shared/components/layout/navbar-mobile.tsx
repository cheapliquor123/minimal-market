import { NavLink } from "react-router-dom"
import { Menu, CheckSquare, Calendar, Home, StickyNote, Repeat } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet"
import { NavbarLogo } from "./navbar-logo"
import { cn } from "@/shared/lib/utils"

const navLinks = [
  { label: "Workspace", path: "/", icon: Home },
  { label: "Tasks", path: "/tasks", icon: CheckSquare },
  { label: "Habits", path: "/habits", icon: Repeat },
  { label: "Calendar", path: "/calendar", icon: Calendar },
  { label: "Notes", path: "/notes", icon: StickyNote },
]

export function NavbarMobile() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b-2 border-border p-4">
          <SheetTitle className="text-left">
            <NavbarLogo />
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 p-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-base px-3 py-2 text-sm font-medium transition-all border-2 border-transparent",
                  isActive
                    ? "bg-main text-main-foreground border-border shadow-shadow"
                    : "text-foreground hover:bg-secondary hover:border-border",
                )
              }
            >
              <link.icon className="size-4" />
              {link.label}
            </NavLink>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
