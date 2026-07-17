import { useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { useSignUp, useAuth } from "@clerk/react-router"
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

export function SignUpForm() {
  const { isSignedIn } = useAuth()
  const { signUp, errors } = useSignUp()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [verifying, setVerifying] = useState(false)
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<"google" | "github" | null>(null)

  if (isSignedIn) {
    return <Navigate to="/" replace />
  }

  const isProcessing = loading || socialLoading !== null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const result = await signUp.create({
      emailAddress: email,
      password,
    })

    if (result.error) {
      setLoading(false)
      return
    }

    if (signUp.status === "complete") {
      await signUp.finalize()
      setLoading(false)
      return
    }

    if (
      signUp.status === "missing_requirements" &&
      signUp.unverifiedFields.includes("email_address")
    ) {
      await signUp.verifications.sendEmailCode()
      setVerifying(true)
    }

    setLoading(false)
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const result = await signUp.verifications.verifyEmailCode({ code })

    if (result.error) {
      setLoading(false)
      return
    }

    if (signUp.status === "complete") {
      await signUp.finalize()
    }

    setLoading(false)
  }

  async function handleSocialLogin(strategy: "oauth_google" | "oauth_github") {
    setSocialLoading(strategy === "oauth_google" ? "google" : "github")

    await signUp.sso({
      strategy,
      redirectUrl: window.location.origin,
      redirectCallbackUrl: window.location.origin,
    })
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h1 className="font-heading text-3xl font-heading">Minimal Market</h1>
        <p className="mt-2 text-muted-foreground">Your productivity workspace</p>
      </div>

      <Card className="w-full max-w-sm hover:shadow-shadow hover:translate-x-0 hover:translate-y-0">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>Create an account to get started.</CardDescription>
        </CardHeader>

        <CardContent>
          {verifying ? (
            <form onSubmit={handleVerifyCode} className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                We sent a verification code to{" "}
                <span className="font-heading text-foreground">{signUp.emailAddress}</span>.
                Enter it below.
              </p>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="sign-up-code" className="text-xs font-heading">
                  Verification code
                </label>
                <Input
                  id="sign-up-code"
                  type="text"
                  placeholder="Enter the code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  autoFocus
                />
                {errors.fields.code && (
                  <p className="text-xs text-destructive">
                    {errors.fields.code.message}
                  </p>
                )}
              </div>

              {errors.global && (
                <p className="text-sm text-destructive">
                  {errors.global[0]?.message || "Verification failed. Please try again."}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading || !code}
                className="w-full bg-main text-main-foreground border-2 border-border shadow-shadow hover:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px]"
              >
                {loading ? "Verifying..." : "Verify"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialLogin("oauth_google")}
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
                  Google
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialLogin("oauth_github")}
                  disabled={isProcessing}
                >
                  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </Button>
              </div>

              <div className="relative flex items-center gap-3">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground">or</span>
                <Separator className="flex-1" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="sign-up-email" className="text-xs font-heading">
                  Email
                </label>
                <Input
                  id="sign-up-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
                {errors.fields.emailAddress && (
                  <p className="text-xs text-destructive">
                    {errors.fields.emailAddress.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="sign-up-password" className="text-xs font-heading">
                  Password
                </label>
                <Input
                  id="sign-up-password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                {errors.fields.password && (
                  <p className="text-xs text-destructive">
                    {errors.fields.password.message}
                  </p>
                )}
              </div>

              {errors.global && (
                <p className="text-sm text-destructive">
                  {errors.global[0]?.message || "Sign up failed. Please try again."}
                </p>
              )}

              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-main text-main-foreground border-2 border-border shadow-shadow hover:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px]"
              >
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/sign-in"
              className="font-heading text-foreground underline underline-offset-4 hover:text-main"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
