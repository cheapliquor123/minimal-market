import { create } from "zustand"

function getToday(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

interface DateStore {
  today: string
  refresh: () => void
}

export const useDateStore = create<DateStore>((set) => ({
  today: getToday(),
  refresh: () => set({ today: getToday() }),
}))

export function useToday(): string {
  return useDateStore((s) => s.today)
}

let intervalId: ReturnType<typeof setInterval> | null = null
let lastKnownDate: string = getToday()
let onDateChange: (() => void) | null = null

export function startTodayRefresh(callback?: () => void) {
  if (intervalId) return
  onDateChange = callback ?? null
  intervalId = setInterval(() => {
    const today = getToday()
    if (today !== lastKnownDate) {
      lastKnownDate = today
      useDateStore.getState().refresh()
      onDateChange?.()
    }
  }, 60_000)
}

export function stopTodayRefresh() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  onDateChange = null
}
