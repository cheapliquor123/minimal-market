/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from "react-router-dom"
import { RootLayout } from "./root-layout"
import { WorkspacePage, TasksPage, HabitsPage, CalendarPage } from "./pages"
import { Suspense } from "react"
import { ErrorBoundary } from "@/shared/components/error-boundary"

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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: withSuspense(WorkspacePage) },
      { path: "tasks", element: withSuspense(TasksPage) },
      { path: "habits", element: withSuspense(HabitsPage) },
      { path: "calendar", element: withSuspense(CalendarPage) },
    ],
  },
])
