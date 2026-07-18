/* eslint-disable react-refresh/only-export-components */
import React, { Suspense } from "react"
import { createBrowserRouter } from "react-router-dom"
import { ClerkProvider } from "@clerk/react-router"
import { shadcn } from "@clerk/ui/themes"
import { RootLayout } from "./root-layout"
import { WorkspacePage, TasksPage, HabitsPage, CalendarPage, NotesPage } from "./pages"
import { ErrorBoundary } from "@/shared/components/error-boundary"

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const SignInPage = () => import("@/features/auth/pages/sign-in-page")
const SignUpPage = () => import("@/features/auth/pages/sign-up-page")

function PageLoader() {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="size-8 animate-spin rounded-base border-4 border-border border-t-main" />
    </div>
  )
}

function withSuspense(Page: React.ComponentType) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Page />
      </Suspense>
    </ErrorBoundary>
  )
}

function LazyPage({ importFn }: { importFn: () => Promise<{ default: React.ComponentType }> }) {
  const Page = React.lazy(() => importFn())
  return withSuspense(Page)
}

function SignInRoute() {
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{ theme: shadcn }}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
    >
      <LazyPage importFn={SignInPage} />
    </ClerkProvider>
  )
}

function SignUpRoute() {
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{ theme: shadcn }}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
    >
      <LazyPage importFn={SignUpPage} />
    </ClerkProvider>
  )
}

export const router = createBrowserRouter([
  {
    path: "/sign-in",
    element: <SignInRoute />,
  },
  {
    path: "/sign-in/*",
    element: <SignInRoute />,
  },
  {
    path: "/sign-up",
    element: <SignUpRoute />,
  },
  {
    path: "/sign-up/*",
    element: <SignUpRoute />,
  },
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: withSuspense(WorkspacePage) },
      { path: "tasks", element: withSuspense(TasksPage) },
      { path: "habits", element: withSuspense(HabitsPage) },
      { path: "calendar", element: withSuspense(CalendarPage) },
      { path: "notes", element: withSuspense(NotesPage) },
    ],
  },
])
