/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react"

interface MutationLike {
  mutate: (vars: any, options?: { onSuccess?: () => void }) => void
  isPending: boolean
}

interface UseEntityFormSubmitOptions {
  editing: { id: string } | null | undefined
  create: MutationLike
  update: MutationLike
  onSuccess: () => void
}

export function useEntityFormSubmit({
  editing,
  create,
  update,
  onSuccess,
}: UseEntityFormSubmitOptions) {
  const handleSubmit = useCallback(
    (input: any) => {
      if (editing) {
        update.mutate(
          { id: editing.id, input },
          { onSuccess },
        )
      } else {
        create.mutate(input, { onSuccess })
      }
    },
    [editing, create, update, onSuccess],
  )

  const isPending = create.isPending || update.isPending

  return { handleSubmit, isPending }
}
