import { toast } from "sonner"

export function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message: unknown }).message)
  }
  if (typeof err === "string") return err
  return "Something went wrong"
}

export function handleMutationError(err: unknown) {
  toast.error(getErrorMessage(err))
}
