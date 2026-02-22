import { describe, it, expect } from "vitest"
import { formatHijriDate } from "./hijri"

describe("formatHijriDate", () => {
  it("returns null for empty string", () => {
    expect(formatHijriDate("")).toBeNull()
  })

  it("returns null for whitespace-only string", () => {
    expect(formatHijriDate("   ")).toBeNull()
  })

  it("returns null for invalid date string", () => {
    expect(formatHijriDate("invalid")).toBeNull()
    expect(formatHijriDate("2026-13-01")).toBeNull()
    expect(formatHijriDate("not-a-date")).toBeNull()
  })

  it("returns formatted Hijri string for valid YYYY-MM-DD", () => {
    const result = formatHijriDate("2026-02-18")
    expect(result).not.toBeNull()
    expect(typeof result).toBe("string")
    expect(result).toMatch(/\d+ \w+ \d+/)
  })

  it("includes day, month name, and year", () => {
    const result = formatHijriDate("2025-01-15")
    expect(result).not.toBeNull()
    expect(result).toMatch(/^\d+ .+ \d+$/)
  })

  it("returns null for undefined-like empty handling", () => {
    expect(formatHijriDate("")).toBeNull()
  })
})
