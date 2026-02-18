/**
 * Generate an .ics (iCalendar) file so guests can add the event to their phone calendar.
 * Works on iOS, Android, and desktop calendar apps.
 */

export interface CalendarEventInput {
  /** Event title (e.g. "Adam & Hawa Wedding") */
  title: string
  /** Event date in YYYY-MM-DD format */
  date: string
  /** Start time in HH:mm (24h) - optional, defaults to 18:00 */
  startTime?: string
  /** End time in HH:mm (24h) - optional, defaults to 23:00 */
  endTime?: string
  /** Venue/location name */
  location?: string
  /** Full address - appended to location if provided */
  address?: string
  /** Event description (e.g. event type) */
  description?: string
}

function pad2(n: number): string {
  return String(n).padStart(2, "0")
}

function escapeIcsText(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,")
}

/**
 * Parse "HH:mm" or "H:mm" to hours and minutes.
 */
function parseTime(time: string): { h: number; m: number } {
  const parts = time.trim().split(":")
  const h = parseInt(parts[0] ?? "0", 10)
  const m = parseInt(parts[1] ?? "0", 10)
  return { h: Math.max(0, Math.min(23, h)), m: Math.max(0, Math.min(59, m)) }
}

function addOneHour(time: string): string {
  const { h, m } = parseTime(time)
  const newH = (h + 1) % 24
  return `${pad2(newH)}:${pad2(m)}`
}

/**
 * Build DTSTART/DTEND in format YYYYMMDDTHHmmss (local time).
 */
function toIcsDateTime(dateStr: string, timeStr: string): string {
  const [y, mo, d] = dateStr.split("-").map(Number)
  const { h, m } = parseTime(timeStr)
  return `${pad2(y)}${pad2(mo)}${pad2(d)}T${pad2(h)}${pad2(m)}00`
}

export function generateIcs(input: CalendarEventInput): string {
  const {
    title,
    date,
    startTime = "18:00",
    endTime = "23:00",
    location = "",
    address = "",
    description = "",
  } = input

  const loc = [location, address].filter(Boolean).join(", ")
  const dtStart = toIcsDateTime(date, startTime)
  // Ensure end is after start (some apps reject same start/end)
  const safeEndTime = startTime === endTime ? addOneHour(endTime) : endTime
  const dtEnd = toIcsDateTime(date, safeEndTime)

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Gatherly//EN",
    "BEGIN:VEVENT",
    "DTSTART:" + dtStart,
    "DTEND:" + dtEnd,
    "SUMMARY:" + escapeIcsText(title || "Event"),
  ]

  if (loc) lines.push("LOCATION:" + escapeIcsText(loc))
  if (description) lines.push("DESCRIPTION:" + escapeIcsText(description))

  lines.push("END:VEVENT", "END:VCALENDAR")

  return lines.join("\r\n")
}

/**
 * Trigger download of .ics file. On mobile, opening the file usually
 * prompts to add the event to the default calendar app.
 */
export function downloadIcs(icsContent: string, filename = "event.ics"): void {
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
