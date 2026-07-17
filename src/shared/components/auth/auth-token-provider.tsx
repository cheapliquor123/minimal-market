import { useEffect } from "react"
import { useAuth } from "@clerk/react-router"
import { setAuthTokenGetter } from "@/shared/lib/api"

export function AuthTokenProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth()

  useEffect(() => {
    setAuthTokenGetter(getToken)
  }, [getToken])

  return <>{children}</>
}
