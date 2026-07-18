import { cn } from "@/shared/lib/utils"

interface SkeletonItemProps {
  className?: string
}

function SkeletonBar({ className }: SkeletonItemProps) {
  return <div className={cn("rounded bg-muted", className)} />
}

export function TaskSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-base border-2 border-border bg-secondary-background p-3 shadow-shadow animate-pulse">
      <div className="size-5 rounded-base bg-muted" />
      <div className="flex-1 space-y-2">
        <SkeletonBar className="h-3 w-2/3" />
        <SkeletonBar className="h-2 w-1/3" />
      </div>
      <div className="h-5 w-10 rounded-base bg-muted" />
    </div>
  )
}

export function HabitSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-base border-2 border-border bg-secondary-background p-4 shadow-shadow animate-pulse">
      <div className="flex items-center gap-2">
        <div className="size-3 rounded-full bg-muted" />
        <SkeletonBar className="h-3 w-24" />
      </div>
      <SkeletonBar className="h-8 w-full" />
    </div>
  )
}

export function NoteSkeleton() {
  return (
    <div className="rounded-base border-2 border-border bg-secondary-background p-4 animate-pulse">
      <SkeletonBar className="h-4 w-2/3 mb-2" />
      <SkeletonBar className="h-3 w-full mb-1" />
      <SkeletonBar className="h-3 w-4/5" />
    </div>
  )
}

export function FolderSkeleton() {
  return (
    <div className="rounded-base border-2 border-border bg-secondary-background p-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="size-8 rounded-base border-2 border-border bg-border" />
        <SkeletonBar className="h-3 w-24" />
      </div>
    </div>
  )
}
