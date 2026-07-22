import { useCallback } from "react"

interface MutationLike<TInput> {
  mutate: (vars: TInput, options?: { onSuccess?: () => void }) => void
  isPending: boolean
}

interface UpdateMutationLike<TInput> {
  mutate: (vars: { id: string; input: TInput }, options?: { onSuccess?: () => void }) => void
  isPending: boolean
}

interface UseEntityFormSubmitOptions<TInput> {
  editing: { id: string } | null | undefined
  create: MutationLike<TInput>
  update: UpdateMutationLike<TInput>
  onSuccess: () => void
}

export function useEntityFormSubmit<TInput>({
  editing,
  create,
  update,
  onSuccess,
}: UseEntityFormSubmitOptions<TInput>) {
  const handleSubmit = useCallback(
    (input: TInput) => {
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
