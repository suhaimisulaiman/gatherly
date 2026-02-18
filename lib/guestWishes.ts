/** Guest wishes stored in localStorage per event */

export type GuestWish = {
  id: string
  name: string
  message: string
}

const WISHES_KEY_PREFIX = "wishes:"

export function loadGuestWishes(eventId: string): GuestWish[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(`${WISHES_KEY_PREFIX}${eventId}`)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed)
      ? parsed.filter((w): w is GuestWish => w && typeof w.name === "string" && typeof w.message === "string")
      : []
  } catch {
    return []
  }
}

export function saveGuestWish(eventId: string, wish: Omit<GuestWish, "id">): GuestWish {
  const full: GuestWish = {
    ...wish,
    id: crypto.randomUUID(),
  }
  const existing = loadGuestWishes(eventId)
  const updated = [...existing, full]
  try {
    localStorage.setItem(`${WISHES_KEY_PREFIX}${eventId}`, JSON.stringify(updated))
  } catch {
    // Ignore quota errors
  }
  return full
}
