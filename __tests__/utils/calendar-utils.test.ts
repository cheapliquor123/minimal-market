import {
  toDateStr,
  fromDateStr,
  getMonthDays,
  getWeekDays,
  navigateDate,
  getViewTitle,
  getViewDateRange,
} from "@/features/calendar/utils"

describe("toDateStr", () => {
  it("formats date as yyyy-MM-dd", () => {
    expect(toDateStr(new Date(2025, 0, 15))).toBe("2025-01-15")
  })

  it("pads single digit month and day", () => {
    expect(toDateStr(new Date(2025, 2, 5))).toBe("2025-03-05")
  })
})

describe("fromDateStr", () => {
  it("parses yyyy-MM-dd to Date at midnight", () => {
    const date = fromDateStr("2025-06-15")
    expect(date.getFullYear()).toBe(2025)
    expect(date.getMonth()).toBe(5)
    expect(date.getDate()).toBe(15)
    expect(date.getHours()).toBe(0)
  })
})

describe("roundtrip", () => {
  it("toDateStr(fromDateStr(x)) === x", () => {
    const str = "2025-12-25"
    expect(toDateStr(fromDateStr(str))).toBe(str)
  })
})

describe("getMonthDays", () => {
  it("returns an array of dates covering the month grid", () => {
    const days = getMonthDays(new Date(2025, 1, 1))
    expect(days.length).toBeGreaterThanOrEqual(28)
    expect(days.length).toBeLessThanOrEqual(42)
  })

  it("starts on Sunday", () => {
    const days = getMonthDays(new Date(2025, 5, 1))
    expect(days[0].getDay()).toBe(0)
  })

  it("ends on Saturday", () => {
    const days = getMonthDays(new Date(2025, 5, 1))
    expect(days[days.length - 1].getDay()).toBe(6)
  })

  it("contains all days of the target month", () => {
    const days = getMonthDays(new Date(2025, 0, 1))
    const janDays = days.filter((d) => d.getMonth() === 0)
    expect(janDays.length).toBe(31)
  })
})

describe("getWeekDays", () => {
  it("always returns exactly 7 days", () => {
    const days = getWeekDays(new Date(2025, 5, 15))
    expect(days).toHaveLength(7)
  })

  it("starts on Sunday", () => {
    const days = getWeekDays(new Date(2025, 5, 17))
    expect(days[0].getDay()).toBe(0)
  })

  it("ends on Saturday", () => {
    const days = getWeekDays(new Date(2025, 5, 17))
    expect(days[6].getDay()).toBe(6)
  })
})

describe("navigateDate", () => {
  const date = new Date(2025, 5, 15)

  it("navigates month forward", () => {
    const result = navigateDate(date, "month", "next")
    expect(result.getMonth()).toBe(6)
  })

  it("navigates month backward", () => {
    const result = navigateDate(date, "month", "prev")
    expect(result.getMonth()).toBe(4)
  })

  it("navigates week forward", () => {
    const result = navigateDate(date, "week", "next")
    expect(result.getDate()).toBe(22)
  })

  it("navigates week backward", () => {
    const result = navigateDate(date, "week", "prev")
    expect(result.getDate()).toBe(8)
  })

  it("navigates day forward", () => {
    const result = navigateDate(date, "day", "next")
    expect(result.getDate()).toBe(16)
  })

  it("navigates day backward", () => {
    const result = navigateDate(date, "day", "prev")
    expect(result.getDate()).toBe(14)
  })
})

describe("getViewTitle", () => {
  it("formats month view as 'Month Year'", () => {
    const title = getViewTitle(new Date(2025, 5, 15), "month")
    expect(title).toBe("June 2025")
  })

  it("formats week view with date range", () => {
    const title = getViewTitle(new Date(2025, 5, 15), "week")
    expect(title).toContain("–")
    expect(title).toContain("2025")
  })

  it("formats day view as full date", () => {
    const title = getViewTitle(new Date(2025, 5, 15), "day")
    expect(title).toContain("Sunday")
    expect(title).toContain("June")
    expect(title).toContain("2025")
  })
})

describe("getViewDateRange", () => {
  it("month range covers the entire target month", () => {
    const { start, end } = getViewDateRange(new Date(2025, 5, 15), "month")
    expect(start.getTime()).toBeLessThanOrEqual(new Date(2025, 5, 1).getTime())
    expect(end.getTime()).toBeGreaterThanOrEqual(new Date(2025, 5, 30, 23, 59, 59).getTime())
  })

  it("week range is exactly 7 days", () => {
    const { start, end } = getViewDateRange(new Date(2025, 5, 15), "week")
    const diffMs = end.getTime() - start.getTime()
    const diffDays = diffMs / (1000 * 60 * 60 * 24)
    expect(Math.round(diffDays)).toBeCloseTo(7, 0)
  })

  it("day range is the same day", () => {
    const { start, end } = getViewDateRange(new Date(2025, 5, 15), "day")
    expect(start.getTime()).toBe(end.getTime())
  })
})
