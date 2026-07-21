import { UserProfile } from "@clerk/react-router"
import { PageHeader } from "@/shared/components/layout/page-header"

export function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Manage your account"
      />

      <UserProfile routing="path" path="/settings" />
    </div>
  )
}
