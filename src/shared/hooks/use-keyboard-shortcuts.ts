import { useEffect } from "react"
import { useTaskDialogStore } from "@/stores/task-dialog-store"
import { useHabitDialogStore } from "@/stores/habit-dialog-store"

export function useKeyboardShortcuts() {
  const openTaskCreate = useTaskDialogStore((s) => s.openCreate)
  const taskDialogClose = useTaskDialogStore((s) => s.close)
  const taskDialogOpen = useTaskDialogStore((s) => s.isOpen)
  const habitDialogClose = useHabitDialogStore((s) => s.close)
  const habitDialogOpen = useHabitDialogStore((s) => s.isOpen)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable

      if (e.key === "Escape") {
        if (taskDialogOpen) {
          e.preventDefault()
          taskDialogClose()
        } else if (habitDialogOpen) {
          e.preventDefault()
          habitDialogClose()
        }
        return
      }

      if (isInput) return

      if (e.key === "n" || e.key === "N") {
        e.preventDefault()
        openTaskCreate()
      }

      if (e.key === "/") {
        e.preventDefault()
        const searchInput = document.querySelector<HTMLInputElement>("[data-slot='search-input']")
        searchInput?.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [openTaskCreate, taskDialogClose, taskDialogOpen, habitDialogClose, habitDialogOpen])
}
