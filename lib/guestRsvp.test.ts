import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { loadGuestRsvp, saveGuestRsvp } from "./guestRsvp"

describe("guestRsvp", () => {
  const eventId = "evt-1"
  const guestSlug = "guest-abc"
  let store: Record<string, string>

  beforeEach(() => {
    store = {}
    const mockStorage = {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value
      },
      clear: () => {
        store = {}
      },
      length: 0,
      removeItem: () => {},
      key: () => null,
    }
    vi.stubGlobal("localStorage", mockStorage)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("returns null when no RSVP stored", () => {
    expect(loadGuestRsvp(eventId, guestSlug)).toBeNull()
  })

  it("saves and loads attending RSVP", () => {
    saveGuestRsvp(eventId, guestSlug, { response: "attending", extraGuests: 0 })
    expect(loadGuestRsvp(eventId, guestSlug)).toEqual({ response: "attending", extraGuests: 0 })
  })

  it("saves and loads not-attending RSVP", () => {
    saveGuestRsvp(eventId, guestSlug, { response: "not-attending", extraGuests: 0 })
    expect(loadGuestRsvp(eventId, guestSlug)).toEqual({ response: "not-attending", extraGuests: 0 })
  })

  it("saves and loads extraGuests", () => {
    saveGuestRsvp(eventId, guestSlug, { response: "attending", extraGuests: 2 })
    expect(loadGuestRsvp(eventId, guestSlug)).toEqual({ response: "attending", extraGuests: 2 })
  })

  it("returns null for invalid response value in storage", () => {
    store["rsvp:evt-1:guest-abc"] = JSON.stringify({ response: "maybe" })
    expect(loadGuestRsvp(eventId, guestSlug)).toBeNull()
  })

  it("returns null for malformed JSON in storage", () => {
    store["rsvp:evt-1:guest-abc"] = "not json"
    expect(loadGuestRsvp(eventId, guestSlug)).toBeNull()
  })

  it("normalizes negative extraGuests to 0", () => {
    store["rsvp:evt-1:guest-abc"] = JSON.stringify({ response: "attending", extraGuests: -1 })
    expect(loadGuestRsvp(eventId, guestSlug)).toEqual({ response: "attending", extraGuests: 0 })
  })

  it("uses separate keys per event and guest", () => {
    saveGuestRsvp("evt-1", "g1", { response: "attending", extraGuests: 0 })
    saveGuestRsvp("evt-1", "g2", { response: "not-attending", extraGuests: 0 })
    saveGuestRsvp("evt-2", "g1", { response: "attending", extraGuests: 1 })
    expect(loadGuestRsvp("evt-1", "g1")).toEqual({ response: "attending", extraGuests: 0 })
    expect(loadGuestRsvp("evt-1", "g2")).toEqual({ response: "not-attending", extraGuests: 0 })
    expect(loadGuestRsvp("evt-2", "g1")).toEqual({ response: "attending", extraGuests: 1 })
  })
})
