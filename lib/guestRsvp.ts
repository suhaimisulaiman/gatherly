/** Guest RSVP response stored in localStorage per event + guest */

export type RsvpResponse = "attending" | "not-attending"

export type GuestRsvp = {
  response: RsvpResponse
  /** Number of extra guests (0 = not bringing anyone) - required when host allows extras */
  extraGuests: number
}

const RSVP_KEY_PREFIX = "rsvp:"

function getKey(eventId: string, guestSlug: string): string {
  return `${RSVP_KEY_PREFIX}${eventId}:${guestSlug}`
}

export function loadGuestRsvp(eventId: string, guestSlug: string): GuestRsvp | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(getKey(eventId, guestSlug))
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    if (parsed && typeof parsed === "object" && "response" in parsed) {
      const r = parsed as { response: string; extraGuests?: number }
      if (r.response === "attending" || r.response === "not-attending") {
        return {
          response: r.response,
          extraGuests: typeof r.extraGuests === "number" ? Math.max(0, r.extraGuests) : 0,
        }
      }
    }
    return null
  } catch {
    return null
  }
}

export function saveGuestRsvp(eventId: string, guestSlug: string, rsvp: GuestRsvp): void {
  try {
    localStorage.setItem(getKey(eventId, guestSlug), JSON.stringify(rsvp))
  } catch {
    /* ignore */
  }
}
