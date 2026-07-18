import { useState, useEffect, useCallback, useRef } from "react"

interface UseTimerOptions {
  goalMinutes: number
  onLog: (minutes: number) => void
}

export function useTimer({ goalMinutes, onLog }: UseTimerOptions) {
  const goalSeconds = goalMinutes * 60
  const [running, setRunning] = useState(false)
  const [remaining, setRemaining] = useState(goalSeconds)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onLogRef = useRef(onLog)
  const goalMinutesRef = useRef(goalMinutes)

  useEffect(() => {
    onLogRef.current = onLog
    goalMinutesRef.current = goalMinutes
  }, [onLog, goalMinutes])

  const stopTimer = useCallback(
    (completed: boolean) => {
      setRunning(false)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (completed) {
        onLogRef.current(goalMinutesRef.current)
      } else {
        setRemaining((prev) => {
          const elapsed = goalSeconds - prev
          const minutes = Math.max(1, Math.round(elapsed / 60))
          onLogRef.current(minutes)
          return prev
        })
      }
      setRemaining(goalSeconds)
    },
    [goalSeconds],
  )

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
              intervalRef.current = null
            }
            setRunning(false)
            onLogRef.current(goalMinutesRef.current)
            return goalSeconds
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [running, goalSeconds])

  const start = useCallback(() => {
    setRemaining(goalSeconds)
    setRunning(true)
  }, [goalSeconds])

  const progress = running
    ? ((goalSeconds - remaining) / goalSeconds) * 100
    : 0

  return { running, remaining, goalSeconds, progress, start, stop: stopTimer }
}
