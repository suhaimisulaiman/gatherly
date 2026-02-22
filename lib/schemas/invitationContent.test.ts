import { describe, it, expect } from "vitest"
import {
  invitationContentSchema,
  eventAgendaItemSchema,
  wishSchema,
  defaultInvitationContent,
} from "./invitationContent"

describe("invitationContentSchema", () => {
  it("parses minimal valid content", () => {
    const result = invitationContentSchema.safeParse({ invitationTitle: "Ahmad & Siti" })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.invitationTitle).toBe("Ahmad & Siti")
      expect(result.data.eventType).toBe("Wedding Ceremony")
      expect(result.data.rsvpMode).toBe("open")
      expect(result.data.galleryPhotos).toEqual([])
    }
  })

  it("rejects title shorter than 3 characters", () => {
    const result = invitationContentSchema.safeParse({ invitationTitle: "ab" })
    expect(result.success).toBe(false)
  })

  it("accepts title of exactly 3 characters", () => {
    const result = invitationContentSchema.safeParse({ invitationTitle: "abc" })
    expect(result.success).toBe(true)
  })

  it("rejects galleryPhotos with more than 20 items", () => {
    const result = invitationContentSchema.safeParse({
      invitationTitle: "Wedding",
      galleryPhotos: Array(21).fill("data:image/png;base64,abc"),
    })
    expect(result.success).toBe(false)
  })

  it("accepts galleryPhotos with up to 20 items", () => {
    const result = invitationContentSchema.safeParse({
      invitationTitle: "Wedding",
      galleryPhotos: Array(20).fill("data:image/png;base64,abc"),
    })
    expect(result.success).toBe(true)
  })

  it("applies defaults for optional fields", () => {
    const result = invitationContentSchema.safeParse({ invitationTitle: "Test" })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.includeHijriDate).toBe(false)
      expect(result.data.enableWishes).toBe(true)
      expect(result.data.maxGuestsPerInvitee).toBe(0)
      expect(result.data.eventAgenda).toEqual([])
      expect(result.data.featuredWishes).toEqual([])
    }
  })

  it("accepts rsvpMode guest-list and open", () => {
    expect(invitationContentSchema.safeParse({ invitationTitle: "Test", rsvpMode: "open" }).success).toBe(true)
    expect(invitationContentSchema.safeParse({ invitationTitle: "Test", rsvpMode: "guest-list" }).success).toBe(true)
  })

  it("rejects invalid rsvpMode", () => {
    const result = invitationContentSchema.safeParse({ invitationTitle: "Test", rsvpMode: "invalid" })
    expect(result.success).toBe(false)
  })

  it("accepts eventAgenda with time and title", () => {
    const result = invitationContentSchema.safeParse({
      invitationTitle: "Test",
      eventAgenda: [{ time: "18:00", title: "Reception" }],
    })
    expect(result.success).toBe(true)
  })

  it("accepts featuredWishes", () => {
    const result = invitationContentSchema.safeParse({
      invitationTitle: "Test",
      featuredWishes: [{ name: "Host", message: "Welcome!" }],
    })
    expect(result.success).toBe(true)
  })
})

describe("eventAgendaItemSchema", () => {
  it("parses with defaults", () => {
    const result = eventAgendaItemSchema.safeParse({})
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.time).toBe("")
      expect(result.data.title).toBe("")
    }
  })
})

describe("wishSchema", () => {
  it("parses with defaults", () => {
    const result = wishSchema.safeParse({})
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe("")
      expect(result.data.message).toBe("")
    }
  })
})

describe("defaultInvitationContent", () => {
  it("has expected default structure", () => {
    expect(defaultInvitationContent.invitationTitle).toBe("")
    expect(defaultInvitationContent.eventType).toBe("Wedding Ceremony")
    expect(defaultInvitationContent.rsvpMode).toBe("open")
    expect(Array.isArray(defaultInvitationContent.galleryPhotos)).toBe(true)
  })

  it("parses when invitationTitle meets min length", () => {
    const result = invitationContentSchema.safeParse({
      ...defaultInvitationContent,
      invitationTitle: "Wedding",
    })
    expect(result.success).toBe(true)
  })
})
