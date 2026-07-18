import { useState } from "react"
import { useDebounce } from "@/shared/hooks/use-debounce"

export function useNotesFilters() {
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 300)
  const [colorFilter, setColorFilter] = useState<string | null>(null)

  return {
    search,
    setSearch,
    debouncedSearch,
    colorFilter,
    setColorFilter,
  }
}
