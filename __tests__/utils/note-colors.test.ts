import { getNoteBg, getNoteStyle, NOTE_COLORS } from "@/shared/lib/note-colors"

describe("getNoteBg", () => {
  it("returns default bg class when color is null", () => {
    expect(getNoteBg(null)).toBe("bg-secondary-background")
  })

  it("returns empty string for a color value", () => {
    expect(getNoteBg("#f28b82")).toBe("")
  })
})

describe("getNoteStyle", () => {
  it("returns undefined when color is null", () => {
    expect(getNoteStyle(null)).toBeUndefined()
  })

  it("returns backgroundColor style for a color value", () => {
    expect(getNoteStyle("#fbbc04")).toEqual({ backgroundColor: "#fbbc04" })
  })
})

describe("NOTE_COLORS", () => {
  it("has a default entry with null value", () => {
    const defaults = NOTE_COLORS.filter((c) => c.value === null)
    expect(defaults).toHaveLength(1)
    expect(defaults[0].label).toBe("Default")
  })

  it("has all expected color entries", () => {
    expect(NOTE_COLORS.length).toBeGreaterThanOrEqual(9)
  })

  it("each entry has value, label, bg, and ring", () => {
    for (const color of NOTE_COLORS) {
      expect(color).toHaveProperty("value")
      expect(color).toHaveProperty("label")
      expect(color).toHaveProperty("bg")
      expect(color).toHaveProperty("ring")
    }
  })
})
