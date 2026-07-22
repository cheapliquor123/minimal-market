import { useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { useSignIn, useAuth } from "@clerk/react-router"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Separator } from "@/shared/components/ui/separator"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/shared/components/ui/card"

export function SignInForm() {
  const { isSignedIn } = useAuth()
  const { signIn, errors } = useSignIn()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState<"idle" | "email" | "google">("idle")

  if (isSignedIn) {
    return <Navigate to="/" replace />
  }

  const isProcessing = loading !== "idle"

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading("email")

    const result = await signIn.create({
      identifier: email,
      password,
    })

    if (result.error) {
      setLoading("idle")
      return
    }

    if (signIn.status === "complete") {
      await signIn.finalize()
    }

    setLoading("idle")
  }

  async function handleGoogleLogin() {
    setLoading("google")

    await signIn.sso({
      strategy: "oauth_google",
      redirectUrl: window.location.origin,
      redirectCallbackUrl: window.location.origin,
    })
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h1 className="font-heading text-3xl">Miniflow</h1>
        <p className="mt-2 text-muted-foreground">Your productivity workspace</p>
      </div>

      <Card className="w-full max-w-sm hover:shadow-shadow hover:translate-x-0 hover:translate-y-0">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Welcome back! Sign in to your account.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={isProcessing}
            >
              <svg className="size-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="relative flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">or</span>
              <Separator className="flex-1" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="sign-in-email" className="text-xs font-heading">
                Email
              </label>
              <Input
                id="sign-in-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              {errors.fields.identifier && (
                <p className="text-xs text-destructive">
                  {errors.fields.identifier.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="sign-in-password" className="text-xs font-heading">
                Password
              </label>
              <Input
                id="sign-in-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              {errors.fields.password && (
                <p className="text-xs text-destructive">
                  {errors.fields.password.message}
                </p>
              )}
            </div>

            {errors.global && (
              <p className="text-sm text-destructive">
                {errors.global[0]?.message || "Sign in failed. Please try again."}
              </p>
            )}

            <Button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-main text-main-foreground border-2 border-border shadow-shadow hover:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px]"
            >
              {loading === "email" ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              to="/sign-up"
              className="font-heading text-foreground underline underline-offset-4 hover:text-main"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
