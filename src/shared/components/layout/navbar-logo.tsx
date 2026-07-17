import { Link } from "react-router-dom"

export function NavbarLogo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 font-heading text-lg text-foreground transition-colors hover:text-main"
    >
      Minimal Market
    </Link>
  )
}
