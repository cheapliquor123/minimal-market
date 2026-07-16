import { Link } from "react-router-dom"

export function NavbarLogo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 font-heading text-lg text-foreground transition-colors hover:text-main"
    >
      <span className="rounded-base bg-main px-2 py-0.5 text-main-foreground text-sm">
        MM
      </span>
      <span className="hidden sm:inline-block">Minimal Market</span>
    </Link>
  )
}
