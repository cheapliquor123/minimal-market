import { useUser, useAuth } from "@clerk/react-router"
import { LogOut, Settings } from "lucide-react"
import { Link } from "react-router-dom"
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/shared/components/ui/dropdown-menu"

export function UserDropdown() {
  const { user } = useUser()
  const { signOut } = useAuth()

  if (!user) return null

  const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.emailAddresses[0]?.emailAddress
  const initials = [user.firstName?.[0], user.lastName?.[0]].filter(Boolean).join("").toUpperCase() || user.emailAddresses[0]?.emailAddress?.[0]?.toUpperCase() || "?"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex size-8 items-center justify-center rounded-full border-2 border-border shadow-shadow transition-all hover:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px] focus:outline-none">
        <Avatar className="size-7">
          <AvatarImage src={user.imageUrl} alt={name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 border-2 border-border shadow-shadow">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-0.5">
            <span className="font-heading text-sm">{name}</span>
            <span className="text-xs text-muted-foreground font-base">
              {user.emailAddresses[0]?.emailAddress}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/settings">
            <Settings className="size-4" />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => signOut()}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
