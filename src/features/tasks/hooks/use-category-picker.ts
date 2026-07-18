import { useState } from "react"
import { useCreateCategory } from "./use-categories"
import { CATEGORY_COLORS } from "../types"

export function useCategoryPicker(onCreated: (name: string) => void) {
  const createCategory = useCreateCategory()
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState("")
  const [newColor, setNewColor] = useState<string>(CATEGORY_COLORS[0].value)

  function handleCreate() {
    if (!newName.trim()) return
    createCategory.mutate(
      { name: newName.trim(), color: newColor },
      {
        onSuccess: (cat) => {
          onCreated(cat.name)
          setNewName("")
          setNewColor(CATEGORY_COLORS[0].value)
          setCreating(false)
        },
      },
    )
  }

  function handleCancel() {
    setCreating(false)
    setNewName("")
  }

  return {
    creating,
    setCreating,
    newName,
    setNewName,
    newColor,
    setNewColor,
    handleCreate,
    handleCancel,
    isPending: createCategory.isPending,
  }
}
