import { useState, useCallback } from "react"

export function useDeleteConfirmation() {
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const confirm = useCallback((id: string) => setDeleteId(id), [])
  const cancel = useCallback(() => setDeleteId(null), [])

  return {
    deleteId,
    isOpen: deleteId !== null,
    confirm,
    cancel,
  }
}
