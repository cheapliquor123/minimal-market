import { cn } from "@/shared/lib/utils"

describe("cn", () => {
  it("merges single class", () => {
    expect(cn("foo")).toBe("foo")
  })

  it("merges multiple classes", () => {
    expect(cn("foo", "bar")).toBe("foo bar")
  })

  it("handles conditional classes", () => {
    expect(cn("foo", false && "bar", "baz")).toBe("foo baz")
  })

  it("deduplicates tailwind classes", () => {
    expect(cn("p-2 p-4")).toBe("p-4")
  })

  it("handles conflicting tailwind classes (last wins)", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500")
  })

  it("handles empty input", () => {
    expect(cn()).toBe("")
  })

  it("handles undefined and null", () => {
    expect(cn(undefined, null, "foo")).toBe("foo")
  })

  it("handles object syntax", () => {
    expect(cn({ foo: true, bar: false })).toBe("foo")
  })

  it("handles arrays", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar")
  })

  it("merges complex tailwind classes", () => {
    expect(cn("px-4 py-2", "px-8")).toBe("py-2 px-8")
  })
})
