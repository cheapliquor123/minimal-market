export const logger = {
  error(message: string, ...args: unknown[]) {
    if (import.meta.env.DEV) {
      console.error(message, ...args)
    }
  },
}
