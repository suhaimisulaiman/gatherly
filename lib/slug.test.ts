import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { generateSlug } from "./slug"

describe("generateSlug", () => {
  beforeEach(() => {
    vi.spyOn(crypto, "getRandomValues").mockImplementation((arr) => {
      const typed = arr as Uint8Array
      for (let i = 0; i < typed.length; i++) typed[i] = 1
      return arr
    })
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-02-18T12:00:00Z"))
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it("returns a string with inv- prefix", () => {
    const slug = generateSlug()
    expect(slug).toMatch(/^inv-/)
  })

  it("includes 6 random URL-safe chars after prefix", () => {
    const slug = generateSlug()
    const afterPrefix = slug.replace(/^inv-/, "")
    expect(afterPrefix.length).toBeGreaterThanOrEqual(6)
    expect(afterPrefix).toMatch(/^[a-z0-9]+$/)
  })

  it("appends base36 timestamp for uniqueness", () => {
    const slug = generateSlug()
    const afterPrefix = slug.replace(/^inv-/, "")
    expect(afterPrefix.length).toBeGreaterThan(6)
  })

  it("produces unique slugs when time advances", () => {
    const slugs = new Set<string>()
    for (let i = 0; i < 5; i++) {
      vi.advanceTimersByTime(1)
      slugs.add(generateSlug())
    }
    expect(slugs.size).toBe(5)
  })

  it("uses only lowercase letters and digits (URL-safe)", () => {
    const slug = generateSlug()
    expect(slug).toMatch(/^inv-[a-z0-9]+$/)
  })
})
