import { UserButton } from "@clerk/react-router"

export function UserDropdown() {
  return (
    <UserButton
      appearance={{
        elements: {
          avatarBox: "size-8",
        },
      }}
    />
  )
}
