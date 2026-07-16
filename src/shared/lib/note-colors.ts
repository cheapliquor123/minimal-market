export const NOTE_COLORS = [
  { value: null, label: "Default", bg: "bg-secondary-background", ring: "ring-border" },
  { value: "#f28b82", label: "Red", bg: "bg-[#f28b82]", ring: "ring-[#f28b82]" },
  { value: "#fbbc04", label: "Orange", bg: "bg-[#fbbc04]", ring: "ring-[#fbbc04]" },
  { value: "#fff475", label: "Yellow", bg: "bg-[#fff475]", ring: "ring-[#fff475]" },
  { value: "#ccff90", label: "Green", bg: "bg-[#ccff90]", ring: "ring-[#ccff90]" },
  { value: "#a7ffeb", label: "Teal", bg: "bg-[#a7ffeb]", ring: "ring-[#a7ffeb]" },
  { value: "#cbf0f8", label: "Blue", bg: "bg-[#cbf0f8]", ring: "ring-[#cbf0f8]" },
  { value: "#aecbfa", label: "Purple", bg: "bg-[#aecbfa]", ring: "ring-[#aecbfa]" },
  { value: "#fdcfe8", label: "Pink", bg: "bg-[#fdcfe8]", ring: "ring-[#fdcfe8]" },
] as const

export function getNoteBg(color: string | null): string {
  if (!color) return "bg-secondary-background"
  return ""
}

export function getNoteStyle(color: string | null): React.CSSProperties | undefined {
  if (!color) return undefined
  return { backgroundColor: color }
}
