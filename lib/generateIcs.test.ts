import { describe, it, expect } from "vitest"
import { generateIcs } from "./generateIcs"

describe("generateIcs", () => {
  it("produces valid VCALENDAR/VEVENT structure", () => {
    const ics = generateIcs({ title: "Wedding", date: "2026-03-15" })
    expect(ics).toContain("BEGIN:VCALENDAR")
    expect(ics).toContain("VERSION:2.0")
    expect(ics).toContain("PRODID:-//Gatherly//EN")
    expect(ics).toContain("BEGIN:VEVENT")
    expect(ics).toContain("END:VEVENT")
    expect(ics).toContain("END:VCALENDAR")
  })

  it("uses default start 18:00 and end 23:00 when not specified", () => {
    const ics = generateIcs({ title: "Event", date: "2026-03-15" })
    expect(ics).toMatch(/DTSTART:20260315T180000/)
    expect(ics).toMatch(/DTEND:20260315T230000/)
  })

  it("uses custom start and end times", () => {
    const ics = generateIcs({
      title: "Morning Event",
      date: "2026-03-15",
      startTime: "09:00",
      endTime: "12:00",
    })
    expect(ics).toMatch(/DTSTART:20260315T090000/)
    expect(ics).toMatch(/DTEND:20260315T120000/)
  })

  it("adjusts end time when same as start (avoids same start/end)", () => {
    const ics = generateIcs({
      title: "Event",
      date: "2026-03-15",
      startTime: "14:00",
      endTime: "14:00",
    })
    expect(ics).toMatch(/DTSTART:20260315T140000/)
    expect(ics).toMatch(/DTEND:20260315T150000/)
  })

  it("escapes special chars in title (semicolon, comma, backslash)", () => {
    const ics = generateIcs({
      title: "Party; at John's, Inc.",
      date: "2026-03-15",
    })
    expect(ics).toContain("SUMMARY:Party\\; at John's\\, Inc.")
  })

  it("includes location when provided", () => {
    const ics = generateIcs({
      title: "Event",
      date: "2026-03-15",
      location: "Grand Hall",
      address: "123 Main St",
    })
    expect(ics).toContain("LOCATION:Grand Hall\\, 123 Main St")
  })

  it("includes description when provided", () => {
    const ics = generateIcs({
      title: "Event",
      date: "2026-03-15",
      description: "Wedding Ceremony",
    })
    expect(ics).toContain("DESCRIPTION:Wedding Ceremony")
  })

  it("defaults title to 'Event' when empty", () => {
    const ics = generateIcs({ title: "", date: "2026-03-15" })
    expect(ics).toContain("SUMMARY:Event")
  })

  it("clamps time to valid range (h 0-23, m 0-59)", () => {
    const ics = generateIcs({
      title: "Event",
      date: "2026-03-15",
      startTime: "25:99",
      endTime: "23:00",
    })
    expect(ics).toMatch(/DTSTART:20260315T235900/)
    expect(ics).toMatch(/DTEND:20260315T230000/)
  })
})
