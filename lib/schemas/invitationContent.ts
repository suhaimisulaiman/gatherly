import { z } from "zod"

export const eventAgendaItemSchema = z.object({
  id: z.string().optional(),
  time: z.string().default(""),
  title: z.string().default(""),
})

export type EventAgendaItem = z.infer<typeof eventAgendaItemSchema>

export const wishSchema = z.object({
  id: z.string().optional(),
  name: z.string().default(""),
  message: z.string().default(""),
})

export type Wish = z.infer<typeof wishSchema>

export const invitationContentSchema = z.object({
  eventType: z.string().optional().default("Wedding Ceremony"),
  invitationTitle: z.string().min(3, "Title must be at least 3 characters").default(""),
  hostNames: z.string().optional().default(""),
  eventDate: z.string().optional().default(""),
  shortGreeting: z.string().optional().default(""),
  includeHijriDate: z.boolean().default(false),
  eventAgenda: z.array(eventAgendaItemSchema).optional().default([]),
  venueName: z.string().optional().default(""),
  address: z.string().optional().default(""),
  googleMapsLink: z.string().optional().default(""),
  wazeLink: z.string().optional().default(""),
  /** Gallery photos as base64 data URLs (max 20) */
  galleryPhotos: z.array(z.string()).max(20).optional().default([]),
  /** When true, show wishes section and allow guests to post wishes */
  enableWishes: z.boolean().default(true),
  /** Sample/featured wishes from host (optional) */
  featuredWishes: z.array(wishSchema).optional().default([]),
  /** RSVP mode: guest-list (named invites) or open (link) */
  rsvpMode: z.enum(["guest-list", "open"]).default("open"),
  /** RSVP deadline (YYYY-MM-DD) - optional */
  rsvpDeadline: z.string().optional().default(""),
  /** Custom RSVP message shown to guests */
  rsvpMessage: z.string().optional().default(""),
  /** Max total guests (optional - host can set capacity) */
  maxGuests: z.number().int().min(0).optional(),
  /** Max extra guests each invitee can bring (0 = no extras) */
  maxGuestsPerInvitee: z.number().int().min(0).optional().default(0),
  /** Card language for labels (e.g. english, bahasa-melayu) - from Step 1 */
  language: z.string().optional().default("english"),
  /** Step 1 options - package, opening style, effects, music */
  packageType: z.string().optional().default("gold"),
  openingStyle: z.string().optional().default("Circle Gate"),
  animatedEffect: z.string().optional().default("none"),
  backgroundMusic: z.boolean().optional().default(false),
  backgroundMusicYoutubeUrl: z.string().optional().default(""),
})

export type InvitationContent = z.infer<typeof invitationContentSchema>

export const defaultInvitationContent: InvitationContent = {
  eventType: "Wedding Ceremony",
  invitationTitle: "",
  hostNames: "",
  eventDate: "",
  shortGreeting: "",
  includeHijriDate: false,
  eventAgenda: [],
  venueName: "",
  address: "",
  googleMapsLink: "",
  wazeLink: "",
  galleryPhotos: [],
  enableWishes: true,
  featuredWishes: [],
  rsvpMode: "open",
  rsvpDeadline: "",
  rsvpMessage: "",
  maxGuests: undefined,
  maxGuestsPerInvitee: 0,
  language: "english",
  packageType: "gold",
  openingStyle: "Circle Gate",
  animatedEffect: "none",
  backgroundMusic: false,
  backgroundMusicYoutubeUrl: "",
}
