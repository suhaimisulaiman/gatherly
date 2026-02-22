"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  CalendarPlus,
  Clock,
  MapPin,
  Heart,
  Send,
  Music,
  Phone,
} from "lucide-react"
import { SiGooglemaps, SiWaze } from "react-icons/si"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { TemplateThemeColors, TemplateDesign, EnvelopeIntroBlockConfig } from "@/lib/templates"
import { InvitationRenderer } from "@/components/invitation/InvitationRenderer"
import { BackgroundMusicPlayer } from "@/components/BackgroundMusicPlayer"
import { formatHijriDate } from "@/lib/hijri"
import { generateIcs, downloadIcs } from "@/lib/generateIcs"
import { loadGuestWishes, saveGuestWish, type GuestWish } from "@/lib/guestWishes"
import { loadGuestRsvp, saveGuestRsvp, type GuestRsvp } from "@/lib/guestRsvp"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface InvitationPreviewProps {
  templateId?: string
  templateName?: string
  templateThumbnail?: string
  colors?: TemplateThemeColors
  design?: TemplateDesign
  envelopeIntro?: EnvelopeIntroBlockConfig
  openingStyle: string
  animatedEffect: string
  language: string
  /** Translated labels per language (from config). Keys: dearPrefix, venue, gallery, etc. */
  labels?: Record<string, string>
  packageType: string
  backgroundMusic: boolean
  /** YouTube video URL for background music (when backgroundMusic is true) */
  backgroundMusicYoutubeUrl?: string
  guestName: boolean
  /** For envelope "To:" line - real guest name */
  envelopeGuestName?: string
  /** For studio preview - mock guest name (e.g. "Encik Ahmad & Family") */
  previewGuestName?: string
  /** Main title (e.g. "Sayf Turns One!", "Aminah & Hakim") */
  invitationTitle?: string
  /** Optional names shown after title (e.g. bride and groom) */
  hostNames?: string
  /** Short greeting (e.g. "Join us to celebrate", "You're invited") */
  shortGreeting?: string
  /** Event type (e.g. Wedding Ceremony) - shown at top of hero */
  eventType?: string
  /** Event date (ISO string or empty) - shown in Date & Time section */
  eventDate?: string
  /** When true, show equivalent Hijri date alongside Gregorian */
  includeHijriDate?: boolean
  /** Event agenda items (time, title) - shown in Date & Time section */
  eventAgenda?: Array<{ time?: string; title?: string }>
  /** Venue name */
  venue?: string
  /** Address */
  address?: string
  /** Google Maps URL - opens when Maps button tapped */
  googleMapsLink?: string
  /** Waze URL - opens when Waze button tapped */
  wazeLink?: string
  /** Gallery photos (base64 data URLs or URLs) - max 20 */
  galleryPhotos?: string[]
  /** When true, show wishes section and allow guests to post */
  enableWishes?: boolean
  /** Sample wishes from host */
  featuredWishes?: Array<{ name?: string; message?: string }>
  /** Event ID for storing guest wishes (required for guest posting) */
  eventId?: string
  /** RSVP mode: guest-list or open */
  rsvpMode?: "guest-list" | "open"
  /** RSVP deadline (YYYY-MM-DD) */
  rsvpDeadline?: string
  /** Custom RSVP message */
  rsvpMessage?: string
  /** Max total guests (optional) */
  maxGuests?: number
  /** Max extra guests per invitee (0 = no extras) */
  maxGuestsPerInvitee?: number
  /** Wax seal initials override (e.g. "SA") */
  sealInitials?: string
  /** When true, start with invitation opened (skip gate) - e.g. for Screen 2 config */
  defaultOpened?: boolean
  /** When set, scroll the preview to this section (e.g. "datetime" for Screen 3) */
  scrollToSection?: "hero" | "datetime" | "venue" | "gallery" | "wishes" | "rsvp"
  className?: string
}

/* ------------------------------------------------------------------ */
/*  Decorators - visual overlays per template                          */
/* ------------------------------------------------------------------ */

function FloralCorners({ color }: { color: string }) {
  const c = color + "35"
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Top-left */}
      <svg className="absolute -top-1 -left-1 size-16 opacity-70" viewBox="0 0 64 64">
        <path d="M8 48 Q8 8 48 8" fill="none" stroke={c} strokeWidth="1.5" />
        <circle cx="14" cy="14" r="3" fill={c} />
        <circle cx="24" cy="10" r="2" fill={c} />
        <circle cx="10" cy="24" r="2" fill={c} />
        <path d="M18 18 Q22 12 28 16 Q22 20 18 18Z" fill={c} />
      </svg>
      {/* Bottom-right */}
      <svg className="absolute -right-1 -bottom-1 size-16 rotate-180 opacity-70" viewBox="0 0 64 64">
        <path d="M8 48 Q8 8 48 8" fill="none" stroke={c} strokeWidth="1.5" />
        <circle cx="14" cy="14" r="3" fill={c} />
        <circle cx="24" cy="10" r="2" fill={c} />
        <circle cx="10" cy="24" r="2" fill={c} />
        <path d="M18 18 Q22 12 28 16 Q22 20 18 18Z" fill={c} />
      </svg>
      {/* Top-right */}
      <svg className="absolute -top-1 -right-1 size-12 -rotate-90 opacity-50" viewBox="0 0 64 64">
        <circle cx="14" cy="14" r="2.5" fill={c} />
        <circle cx="22" cy="10" r="1.5" fill={c} />
      </svg>
      {/* Bottom-left */}
      <svg className="absolute -bottom-1 -left-1 size-12 rotate-90 opacity-50" viewBox="0 0 64 64">
        <circle cx="14" cy="14" r="2.5" fill={c} />
        <circle cx="22" cy="10" r="1.5" fill={c} />
      </svg>
    </div>
  )
}

function GeometricBorder({ color }: { color: string }) {
  const c = color + "30"
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-3 border" style={{ borderColor: c }} />
      <div className="absolute inset-5 border" style={{ borderColor: c }} />
      {/* Corner accents */}
      {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map((pos) => (
        <div key={pos} className={`absolute ${pos} size-3`} style={{ border: `1.5px solid ${c}` }} />
      ))}
    </div>
  )
}

function DotsScatter({ color }: { color: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 2 + (i % 3) * 1.5,
            height: 2 + (i % 3) * 1.5,
            background: color + "25",
            left: `${(i * 17 + 5) % 90}%`,
            top: `${(i * 23 + 3) % 95}%`,
          }}
        />
      ))}
    </div>
  )
}

function StarScatter({ color }: { color: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 14 }).map((_, i) => (
        <svg
          key={i}
          className="absolute"
          style={{
            width: 6 + (i % 3) * 3,
            height: 6 + (i % 3) * 3,
            left: `${(i * 19 + 8) % 88}%`,
            top: `${(i * 29 + 4) % 92}%`,
            opacity: 0.18 + (i % 3) * 0.07,
          }}
          viewBox="0 0 12 12"
        >
          <path d="M6 0 L7.5 4 L12 4.5 L8.5 7.5 L9.5 12 L6 9.5 L2.5 12 L3.5 7.5 L0 4.5 L4.5 4 Z" fill={color} />
        </svg>
      ))}
    </div>
  )
}

function ArabesqueFrame({ color }: { color: string }) {
  const c = color + "30"
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Outer frame */}
      <div className="absolute inset-2 border" style={{ borderColor: c }} />
      {/* Inner frame with arch top */}
      <svg className="absolute inset-0 size-full" viewBox="0 0 280 580" preserveAspectRatio="none">
        <path d="M30 30 L30 550 L250 550 L250 30 Q140 0 30 30Z" fill="none" stroke={c} strokeWidth="1" />
        {/* Corner ornaments */}
        <circle cx="30" cy="30" r="4" fill={c} />
        <circle cx="250" cy="30" r="4" fill={c} />
        <circle cx="30" cy="550" r="4" fill={c} />
        <circle cx="250" cy="550" r="4" fill={c} />
        {/* Mid ornaments */}
        <circle cx="140" cy="12" r="3" fill={c} />
        <path d="M132 8 L140 2 L148 8" fill="none" stroke={c} strokeWidth="0.8" />
      </svg>
    </div>
  )
}

function LineMinimal({ color }: { color: string }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute top-4 left-4 right-4 h-px" style={{ background: color + "20" }} />
      <div className="absolute bottom-4 left-4 right-4 h-px" style={{ background: color + "20" }} />
    </div>
  )
}

function Decorator({ type, color }: { type: string; color: string }) {
  switch (type) {
    case "floral-corners": return <FloralCorners color={color} />
    case "geometric-border": return <GeometricBorder color={color} />
    case "dots-scatter": return <DotsScatter color={color} />
    case "star-scatter": return <StarScatter color={color} />
    case "arabesque-frame": return <ArabesqueFrame color={color} />
    case "line-minimal": return <LineMinimal color={color} />
    default: return null
  }
}

/* ------------------------------------------------------------------ */
/*  Dividers                                                           */
/* ------------------------------------------------------------------ */

function Divider({ style, color }: { style: string; color: string }) {
  switch (style) {
    case "line":
      return <div className="my-3 h-px w-8" style={{ background: color }} />
    case "ornament":
      return (
        <div className="my-3 flex items-center gap-2">
          <div className="h-px w-4" style={{ background: color + "40" }} />
          <svg width="10" height="10" viewBox="0 0 10 10"><path d="M5 0 L6.5 3.5 L10 5 L6.5 6.5 L5 10 L3.5 6.5 L0 5 L3.5 3.5Z" fill={color + "50"} /></svg>
          <div className="h-px w-4" style={{ background: color + "40" }} />
        </div>
      )
    case "dots":
      return (
        <div className="my-3 flex items-center gap-1.5">
          {[1, 2, 3].map(i => <div key={i} className="size-1 rounded-full" style={{ background: color + "50" }} />)}
        </div>
      )
    case "diamond":
      return (
        <div className="my-3 flex items-center gap-2">
          <div className="h-px w-5" style={{ background: color + "30" }} />
          <div className="size-2 rotate-45" style={{ border: `1px solid ${color}50` }} />
          <div className="h-px w-5" style={{ background: color + "30" }} />
        </div>
      )
    default:
      return null
  }
}

/* ------------------------------------------------------------------ */
/*  Accent shape for icon containers                                   */
/* ------------------------------------------------------------------ */

function AccentIcon({ shape, color, children }: { shape: string; color: string; children: React.ReactNode }) {
  const base = "flex items-center justify-center"
  switch (shape) {
    case "arch":
      return (
        <div className={cn(base, "rounded-t-full rounded-b-md border p-3")} style={{ borderColor: color + "30" }}>
          {children}
        </div>
      )
    case "diamond":
      return (
        <div className={cn(base, "rotate-45 border p-3")} style={{ borderColor: color + "30" }}>
          <div className="-rotate-45">{children}</div>
        </div>
      )
    case "square":
      return (
        <div className={cn(base, "rounded-md border p-3")} style={{ borderColor: color + "30" }}>
          {children}
        </div>
      )
    default:
      return (
        <div className={cn(base, "rounded-full border p-3")} style={{ borderColor: color + "30" }}>
          {children}
        </div>
      )
  }
}

/* ------------------------------------------------------------------ */
/*  Animated effects                                                   */
/* ------------------------------------------------------------------ */

function FloatingDots({ color }: { color: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          className="absolute rounded-full opacity-40"
          style={{
            width: 3 + (i % 4) * 2,
            height: 3 + (i % 4) * 2,
            background: color,
            left: `${8 + ((i * 23) % 84)}%`,
            top: `${5 + ((i * 17) % 90)}%`,
            animation: `floatUp ${3 + (i % 3)}s ease-in-out ${(i * 0.4) % 2}s infinite alternate`,
          }}
        />
      ))}
      <style>{`@keyframes floatUp { 0% { transform: translateY(0) scale(1); opacity: 0.3; } 100% { transform: translateY(-18px) scale(1.3); opacity: 0.6; } }`}</style>
    </div>
  )
}

function ConfettiEffect() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 18 }).map((_, i) => {
        const hue = (i * 40) % 360
        return (
          <span
            key={i}
            className="absolute"
            style={{
              width: 4 + (i % 3) * 2,
              height: 2 + (i % 2) * 4,
              borderRadius: i % 3 === 0 ? "50%" : "1px",
              background: `hsl(${hue}, 70%, 60%)`,
              left: `${4 + ((i * 19) % 92)}%`,
              top: `-5%`,
              animation: `confettiFall ${2.5 + (i % 3) * 0.8}s ease-in ${(i * 0.2) % 2}s infinite`,
            }}
          />
        )
      })}
      <style>{`@keyframes confettiFall { 0% { transform: translateY(0) rotate(0deg); opacity: 0.9; } 100% { transform: translateY(600px) rotate(720deg); opacity: 0; } }`}</style>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Opening gates                                                      */
/* ------------------------------------------------------------------ */

function WindowGate({
  onOpen,
  guestLine,
  inviteLine,
  colors,
  design,
}: {
  onOpen: () => void
  guestLine: string
  inviteLine: string
  colors: TemplateThemeColors
  design: TemplateDesign
}) {
  const [opened, setOpened] = useState(false)

  function handleOpen() {
    setOpened(true)
    setTimeout(onOpen, 600)
  }

  return (
    <div className="absolute inset-0 z-30 overflow-hidden" style={{ background: colors.bg }}>
      <Decorator type={design.decorator} color={colors.accent} />
      {/* Left panel */}
      <div
        className="absolute inset-y-0 left-0 w-1/2 border-r transition-transform duration-600 ease-in-out"
        style={{ background: colors.bg, borderColor: colors.accent + "30", transform: opened ? "translateX(-100%)" : "translateX(0)" }}
      >
        <div className="flex h-full items-center justify-end pr-2">
          <div className="h-20 w-px" style={{ background: colors.accent + "40" }} />
        </div>
      </div>
      {/* Right panel */}
      <div
        className="absolute inset-y-0 right-0 w-1/2 border-l transition-transform duration-600 ease-in-out"
        style={{ background: colors.bg, borderColor: colors.accent + "30", transform: opened ? "translateX(100%)" : "translateX(0)" }}
      >
        <div className="flex h-full items-center justify-start pl-2">
          <div className="h-20 w-px" style={{ background: colors.accent + "40" }} />
        </div>
      </div>
      {/* Center content */}
      {!opened && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 text-center">
          <h2
            className={cn("text-base", design.fontPairing === "serif" ? "font-serif" : "font-sans")}
            style={{ color: colors.text, fontWeight: design.headingWeight, letterSpacing: design.letterSpacing }}
          >
            {guestLine}
          </h2>
          {inviteLine && <p className="text-[8px] uppercase tracking-[0.35em]" style={{ color: colors.muted }}>{inviteLine}</p>}
          <button
            onClick={handleOpen}
            className="mt-1 px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] transition-transform hover:scale-105 active:scale-95"
            style={{ background: colors.text, color: colors.bg, borderRadius: design.borderRadius }}
          >
            Open
          </button>
        </div>
      )}
    </div>
  )
}

function CircleGate({
  onOpen,
  guestLine,
  inviteLine,
  colors,
  design,
}: {
  onOpen: () => void
  guestLine: string
  inviteLine: string
  colors: TemplateThemeColors
  design: TemplateDesign
}) {
  const [opened, setOpened] = useState(false)

  function handleOpen() {
    setOpened(true)
    setTimeout(onOpen, 500)
  }

  return (
    <div
      className={cn("absolute inset-0 z-30 flex flex-col items-center justify-center transition-all duration-500", opened && "pointer-events-none scale-150 opacity-0")}
      style={{ background: colors.bg }}
    >
      <Decorator type={design.decorator} color={colors.accent} />
      <Divider style={design.divider} color={colors.accent} />
      <h2
        className={cn("mt-4 text-lg leading-tight", design.fontPairing === "serif" ? "font-serif" : "font-sans")}
        style={{ color: colors.text, fontWeight: design.headingWeight, letterSpacing: design.letterSpacing }}
      >
        {guestLine}
      </h2>
      {inviteLine && <p className="mt-3 text-[8px] uppercase tracking-[0.35em]" style={{ color: colors.muted }}>{inviteLine}</p>}
      <button
        onClick={handleOpen}
        className="mt-5 flex size-14 items-center justify-center rounded-full border-2 transition-transform hover:scale-105 active:scale-95"
        style={{ background: colors.text, color: colors.bg, borderColor: colors.accent + "40" }}
      >
        <span className="text-[9px] font-semibold uppercase tracking-[0.15em]">Open</span>
      </button>
      <ChevronDown className="mt-3 size-3.5 animate-bounce" style={{ color: colors.muted + "60" }} />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Wishes form - guest post wish                                      */
/* ------------------------------------------------------------------ */

function WishesForm({
  eventId,
  onWishSubmit,
  colors,
  design,
}: {
  eventId: string
  onWishSubmit: (wish: { name: string; message: string }) => void
  colors: TemplateThemeColors
  design: TemplateDesign
}) {
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const n = name.trim()
    const m = message.trim()
    if (!n || !m) return
    onWishSubmit({ name: n, message: m })
    setName("")
    setMessage("")
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex w-full flex-col gap-2">
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border px-2 py-1.5 text-[10px]"
        style={{ borderColor: colors.accent + "40", borderRadius: design.borderRadius, color: colors.text }}
      />
      <textarea
        placeholder="Your wish..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={2}
        className="w-full resize-none border px-2 py-1.5 text-[10px]"
        style={{ borderColor: colors.accent + "40", borderRadius: design.borderRadius, color: colors.text }}
      />
      <button
        type="submit"
        className="w-full py-1.5 text-[10px] font-medium"
        style={{ background: colors.text, color: colors.bg, borderRadius: design.borderRadius }}
      >
        Post Wish
      </button>
    </form>
  )
}

/* ------------------------------------------------------------------ */
/*  RSVP section - guest can RSVP, update, and specify extra guests    */
/* ------------------------------------------------------------------ */

function RsvpSection({
  eventId,
  guestRsvp,
  onRsvpChange,
  maxGuestsPerInvitee,
  colors,
  design,
}: {
  eventId: string
  guestRsvp: GuestRsvp | null
  onRsvpChange: (rsvp: GuestRsvp | null) => void
  maxGuestsPerInvitee: number
  colors: TemplateThemeColors
  design: TemplateDesign
}) {
  const [editing, setEditing] = useState(false)
  const [response, setResponse] = useState<"attending" | "not-attending">("attending")
  const [extraGuests, setExtraGuests] = useState(0)
  const showForm = !guestRsvp || editing

  const handleSubmit = () => {
    const r: GuestRsvp = {
      response,
      extraGuests: response === "attending" ? Math.min(extraGuests, maxGuestsPerInvitee) : 0,
    }
    saveGuestRsvp(eventId, "preview", r)
    onRsvpChange(r)
    setEditing(false)
  }

  const handleChange = () => {
    if (guestRsvp) {
      setResponse(guestRsvp.response)
      setExtraGuests(guestRsvp.extraGuests)
    }
    setEditing(true)
  }

  const needsExtraGuests = response === "attending" && maxGuestsPerInvitee > 0

  if (showForm) {
    return (
      <div className="mt-4 flex flex-col gap-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setResponse("attending")}
            className={`flex-1 px-3 py-1.5 text-[10px] font-medium transition-colors ${response === "attending" ? "" : "opacity-60"}`}
            style={{
              background: response === "attending" ? colors.text : colors.accent + "20",
              color: response === "attending" ? colors.bg : colors.text,
              borderRadius: design.borderRadius,
              border: response === "attending" ? undefined : `1px solid ${colors.accent}40`,
            }}
          >
            Attending
          </button>
          <button
            type="button"
            onClick={() => setResponse("not-attending")}
            className={`flex-1 border px-3 py-1.5 text-[10px] font-medium transition-colors ${response === "not-attending" ? "" : "opacity-60"}`}
            style={{
              borderColor: response === "not-attending" ? colors.text : colors.accent + "40",
              background: response === "not-attending" ? colors.text : "transparent",
              color: response === "not-attending" ? colors.bg : colors.text,
              borderRadius: design.borderRadius,
            }}
          >
            Not Attending
          </button>
        </div>
        {needsExtraGuests && (
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-[9px]" style={{ color: colors.muted }}>
              Extra guests:
            </label>
            <select
              value={extraGuests}
              onChange={(e) => setExtraGuests(parseInt(e.target.value, 10))}
              className="border px-2 py-1 text-[10px]"
              style={{ borderColor: colors.accent + "40", borderRadius: design.borderRadius, color: colors.text }}
            >
              {Array.from({ length: maxGuestsPerInvitee + 1 }, (_, i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
            <span className="text-[9px]" style={{ color: colors.muted }}>(max {maxGuestsPerInvitee})</span>
          </div>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full py-1.5 text-[10px] font-medium"
          style={{ background: colors.text, color: colors.bg, borderRadius: design.borderRadius }}
        >
          Submit
        </button>
        <p className="text-[9px]" style={{ color: colors.muted }}>
          You can update your response anytime.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-4 flex flex-col gap-2">
      <div className="border px-4 py-2" style={{ borderColor: colors.accent + "30", background: colors.accent + "10", borderRadius: design.borderRadius }}>
        <p className="text-[10px] font-medium" style={{ color: colors.text }}>
          {guestRsvp!.response === "attending"
            ? guestRsvp!.extraGuests > 0
              ? `You're attending with ${guestRsvp!.extraGuests} extra guest${guestRsvp!.extraGuests > 1 ? "s" : ""}`
              : "You're attending"
            : "You're not attending"}
        </p>
      </div>
      <button
        type="button"
        onClick={handleChange}
        className="text-[9px] underline"
        style={{ color: colors.muted }}
      >
        Change response
      </button>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Section constants                                                  */
/* ------------------------------------------------------------------ */

const SECTIONS = ["gate", "hero", "datetime", "venue", "gallery", "wishes", "rsvp"] as const
type SectionId = (typeof SECTIONS)[number]

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

function getEnvelopeOpenedKey(templateId?: string, inviteeSlug?: string): string | null {
  if (!templateId) return null
  const slug = inviteeSlug ?? "preview"
  return `invitation_envelope_opened_${templateId}_${slug}`
}

export function InvitationPreview({
  templateId,
  templateName,
  templateThumbnail,
  colors,
  design,
  envelopeIntro,
  openingStyle,
  animatedEffect,
  language,
  labels,
  packageType,
  backgroundMusic,
  backgroundMusicYoutubeUrl,
  guestName,
  envelopeGuestName,
  previewGuestName,
  invitationTitle,
  hostNames,
  shortGreeting,
  eventType,
  eventDate,
  includeHijriDate,
  eventAgenda,
  venue: venueProp,
  address: addressProp,
  googleMapsLink,
  wazeLink,
  galleryPhotos,
  enableWishes = true,
  featuredWishes = [],
  eventId,
  rsvpMode = "open",
  rsvpDeadline,
  rsvpMessage,
  maxGuests,
  maxGuestsPerInvitee = 0,
  sealInitials,
  defaultOpened = false,
  scrollToSection,
  className,
}: InvitationPreviewProps) {
  const useEnvelope = Boolean(envelopeIntro)
  const [isOpened, setIsOpened] = useState(defaultOpened)
  const [activeSection, setActiveSection] = useState<SectionId>("gate")
  const [guestRsvp, setGuestRsvp] = useState<GuestRsvp | null>(null)
  const [guestWishes, setGuestWishes] = useState<GuestWish[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Partial<Record<SectionId, HTMLDivElement | null>>>({})

  useEffect(() => {
    if (!useEnvelope && !defaultOpened) {
      setIsOpened(false)
    }
    setActiveSection(defaultOpened ? "hero" : "gate")
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [openingStyle, useEnvelope])

  useEffect(() => {
    if (useEnvelope && typeof window !== "undefined") {
      const key = getEnvelopeOpenedKey(templateId, "preview")
      if (key && sessionStorage.getItem(key) === "1") {
        setIsOpened(true)
      }
    }
  }, [useEnvelope, templateId])

  useEffect(() => {
    if (scrollToSection && isOpened && sectionRefs.current[scrollToSection]) {
      sectionRefs.current[scrollToSection]?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [scrollToSection, isOpened])

  useEffect(() => {
    if (eventId && typeof window !== "undefined") {
      setGuestWishes(loadGuestWishes(eventId))
      setGuestRsvp(loadGuestRsvp(eventId, "preview"))
    }
  }, [eventId])

  const t = (key: string, fallback: string) => (labels?.[key] ?? fallback)
  const c: TemplateThemeColors = colors || { bg: "#faf8f5", text: "#1c1917", accent: "#a68a6b", muted: "#78716c" }
  const d: TemplateDesign = design || {
    fontPairing: "serif", headingWeight: "400", letterSpacing: "0.04em",
    decorator: "line-minimal", heroLayout: "centered", divider: "line",
    bgPattern: null, borderRadius: "12px", accentShape: "circle",
  }

  const coupleName = invitationTitle || "Sarah & Ahmed"
  const gateGuestName = previewGuestName ?? envelopeGuestName ?? "Guest"
  const gateGuestLine = `${t("dearPrefix", "Dear")} ${gateGuestName}`
  const gateInviteLine = shortGreeting?.trim() ?? ""
  const date = eventDate?.trim()
    ? (() => {
        try {
          const d = new Date(eventDate)
          return Number.isNaN(d.getTime()) ? "Saturday, March 15, 2026" : d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
        } catch {
          return "Saturday, March 15, 2026"
        }
      })()
    : "Saturday, March 15, 2026"
  const hijriDate = includeHijriDate && eventDate?.trim() ? formatHijriDate(eventDate) : null

  function formatTime12h(time: string): string {
    if (!time?.trim()) return ""
    const [hStr, mStr] = time.trim().split(":")
    const h = parseInt(hStr ?? "0", 10)
    const m = parseInt(mStr ?? "0", 10)
    if (h === 0 && m === 0) return "12:00 AM"
    if (h === 12) return `12:${String(m).padStart(2, "0")} PM`
    if (h > 12) return `${h - 12}:${String(m).padStart(2, "0")} PM`
    return `${h}:${String(m).padStart(2, "0")} AM`
  }

  const agendaItems = (eventAgenda ?? []).filter((i) => (i.time?.trim() || i.title?.trim()))
  const time = agendaItems.length === 0 ? "6:00 PM - 11:00 PM" : undefined
  const venue = venueProp?.trim() || "The Grand Pavilion"
  const address = addressProp?.trim() || "123 Garden Boulevard, Kuala Lumpur"
  const hasGoogleMaps = googleMapsLink?.trim() && /^https?:\/\//.test(googleMapsLink.trim())
  const hasWaze = wazeLink?.trim() && /^https?:\/\//.test(wazeLink.trim())

  function formatRsvpDeadline(dateStr: string): string {
    try {
      const d = new Date(dateStr)
      if (Number.isNaN(d.getTime())) return dateStr
      return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    } catch {
      return dateStr
    }
  }

  const handleAddToCalendar = useCallback(() => {
    const dateStr = eventDate?.trim()
    if (!dateStr) return
    const startTime = agendaItems.length > 0 && agendaItems[0].time?.trim()
      ? agendaItems[0].time.trim()
      : "18:00"
    const endTime = agendaItems.length > 0 && agendaItems[agendaItems.length - 1]?.time?.trim()
      ? agendaItems[agendaItems.length - 1].time!.trim()
      : "23:00"
    const ics = generateIcs({
      title: invitationTitle?.trim() || coupleName,
      date: dateStr,
      startTime,
      endTime,
      location: venue,
      address,
      description: eventType?.trim() || undefined,
    })
    downloadIcs(ics, "event.ics")
  }, [eventDate, agendaItems, invitationTitle, coupleName, venue, address, eventType])

  const inviteLabel = shortGreeting?.trim() ?? ""

  const headingClass = d.fontPairing === "serif" ? "font-serif" : "font-sans"
  const headingStyle = { color: c.text, fontWeight: d.headingWeight, letterSpacing: d.letterSpacing }

  const handleGateOpen = useCallback(() => {
    setIsOpened(true)
    setActiveSection("hero")
    setTimeout(() => { sectionRefs.current.hero?.scrollIntoView({ behavior: "smooth", block: "start" }) }, 100)
  }, [])

  const handleCloseToGate = useCallback(() => {
    setIsOpened(false)
    setActiveSection("gate")
    scrollRef.current?.scrollTo({ top: 0, behavior: "instant" })
  }, [])

  useEffect(() => {
    const container = scrollRef.current
    if (!container || !isOpened) return
    const observer = new IntersectionObserver(
      (entries) => { for (const entry of entries) { if (entry.isIntersecting) { const id = entry.target.getAttribute("data-section") as SectionId | null; if (id) setActiveSection(id) } } },
      { root: container, threshold: 0.5 }
    )
    for (const id of SECTIONS) { const el = sectionRefs.current[id]; if (el && id !== "gate") observer.observe(el) }
    return () => observer.disconnect()
  }, [isOpened])

  const goNext = useCallback(() => {
    const visibleSections = SECTIONS.filter((s) => s !== "gate")
    const idx = visibleSections.indexOf(activeSection)
    if (idx < visibleSections.length - 1) {
      const next = visibleSections[idx + 1]
      sectionRefs.current[next]?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [activeSection])

  const registerRef = (id: SectionId) => (el: HTMLDivElement | null) => { sectionRefs.current[id] = el }

  const showEffect = isOpened && animatedEffect !== "none"

  const isLeftAligned = d.heroLayout === "left-aligned"
  const sectionAlign = isLeftAligned ? "items-start text-left" : "items-center text-center"

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <BackgroundMusicPlayer
        enabled={backgroundMusic}
        youtubeUrl={backgroundMusicYoutubeUrl}
      />
      {/* Phone frame */}
      <div className="relative mx-auto w-[280px] rounded-[42px] border-[6px] border-foreground/90 bg-foreground/90 shadow-2xl">
        <div className="absolute top-0 left-1/2 z-40 h-6 w-[100px] -translate-x-1/2 rounded-b-2xl bg-foreground/90" />

        {/* Screen */}
        <div
          ref={scrollRef}
          className="relative aspect-[9/19.5] w-full overflow-y-auto overflow-x-hidden rounded-[36px] scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            background: c.bg,
            ...(d.bgPattern ? { backgroundImage: d.bgPattern } : {}),
          }}
        >
          {/* Close / back to gate (only when gate, not envelope) */}
          {!useEnvelope && isOpened && (
            <button
              onClick={handleCloseToGate}
              className="absolute left-3 top-3 z-50 flex size-8 items-center justify-center rounded-full shadow-md transition-transform hover:scale-110 active:scale-95"
              style={{ background: c.bg, color: c.text, border: `1px solid ${c.accent}40` }}
              aria-label="Close invitation"
            >
              <ChevronUp className="size-4" />
            </button>
          )}
          {/* Template decorator overlay */}
          {(isOpened || useEnvelope) && <Decorator type={d.decorator} color={c.accent} />}

          {/* Animated effects */}
          {showEffect && animatedEffect === "Floating Dots" && <FloatingDots color={c.accent} />}
          {showEffect && animatedEffect === "Confetti" && <ConfettiEffect />}

          {/* Block renderer: envelope intro + content */}
          <InvitationRenderer
            onEnvelopeOpen={handleGateOpen}
            envelopeIntro={envelopeIntro}
            templateId={templateId}
            inviteeSlug="preview"
            guestName={envelopeGuestName}
            previewGuestName={previewGuestName ?? (guestName ? "Encik Ahmad & Family" : undefined)}
            sealInitials={sealInitials}
            labels={labels}
          >
          {/* Opening gate (when no envelope) */}
          {!useEnvelope && !isOpened && openingStyle === "Window" && (
            <WindowGate onOpen={handleGateOpen} guestLine={gateGuestLine} inviteLine={gateInviteLine} colors={c} design={d} />
          )}
          {!useEnvelope && !isOpened && openingStyle !== "Window" && (
            <CircleGate onOpen={handleGateOpen} guestLine={gateGuestLine} inviteLine={gateInviteLine} colors={c} design={d} />
          )}

          {/* Scrollable sections - render when opened OR when envelope (so scroll target exists) */}
          {(isOpened || useEnvelope) && (
            <>
              {/* Hero */}
              <div
                ref={registerRef("hero")}
                data-section="hero"
                className={cn("flex min-h-full w-full flex-col justify-center px-6 py-10", sectionAlign)}
              >
                <p className="text-[8px] uppercase tracking-[0.35em]" style={{ color: c.muted }}>
                  {eventType?.trim() || "Wedding Ceremony"}
                </p>
                {templateThumbnail && (
                  <div
                    className="mt-4 mb-4 size-16 shrink-0 overflow-hidden border-2"
                    style={{
                      borderColor: c.accent + "40",
                      borderRadius: d.accentShape === "circle" ? "50%" : d.accentShape === "arch" ? "50% 50% 8px 8px" : d.accentShape === "diamond" ? "4px" : "8px",
                      transform: d.accentShape === "diamond" ? "rotate(45deg)" : undefined,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={templateThumbnail}
                      alt=""
                      className="size-full object-cover"
                      style={{ transform: d.accentShape === "diamond" ? "rotate(-45deg) scale(1.4)" : undefined }}
                    />
                  </div>
                )}
                <Divider style={d.divider} color={c.accent} />
                {inviteLabel && <p className="mt-4 text-[8px] uppercase tracking-[0.3em]" style={{ color: c.muted }}>{inviteLabel}</p>}
                <h2 className={cn("mt-3 text-lg", headingClass)} style={headingStyle}>{coupleName}</h2>
                {hostNames?.trim() && (
                  <h3
                    className="mt-3 text-2xl font-normal"
                    style={{ fontFamily: "var(--font-script), cursive", color: c.text, letterSpacing: "0.02em" }}
                  >
                    {hostNames.trim()}
                  </h3>
                )}
                <div className="mt-4 border px-4 py-2" style={{ borderColor: c.accent + "40", borderRadius: d.borderRadius }}>
                <p className="text-xs font-medium" style={{ color: c.text }}>{date}</p>
                {hijriDate && (
                  <p className="mt-1 text-[10px]" style={{ color: c.muted }}>{hijriDate}</p>
                )}
                </div>
              </div>

              {/* Date & Time */}
              <div ref={registerRef("datetime")} data-section="datetime" className={cn("flex min-h-full w-full flex-col justify-center px-6 py-10", sectionAlign)}>
                <AccentIcon shape={d.accentShape} color={c.accent}>
                  <Calendar className="size-5" style={{ color: c.text }} />
                </AccentIcon>
                <h3 className={cn("mt-3 text-[10px] font-semibold uppercase tracking-[0.2em]", headingClass)} style={{ color: c.text }}>{t("saveTheDate", "Save the Date")}</h3>
                <Divider style={d.divider} color={c.accent} />
                <p className="text-xs font-medium" style={{ color: c.text }}>{date}</p>
                {hijriDate && (
                  <p className="mt-1 text-[10px]" style={{ color: c.muted }}>{hijriDate}</p>
                )}
                {agendaItems.length > 0 ? (
                  <div className="mt-3 flex flex-col gap-2">
                    {agendaItems.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 gap-x-4">
                        {item.time?.trim() && (
                          <div className="flex shrink-0 items-center gap-1.5">
                            <Clock className="size-2.5 shrink-0" style={{ color: c.muted }} />
                            <span className="text-[10px] font-medium tabular-nums" style={{ color: c.text }}>{formatTime12h(item.time)}</span>
                          </div>
                        )}
                        {item.title?.trim() && (
                          <p className="text-[10px] leading-relaxed flex-1" style={{ color: c.text }}>{item.title.trim()}</p>
                        )}
                        {!item.title?.trim() && item.time?.trim() && <span className="flex-1" />}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-2 flex items-center gap-1.5">
                    <Clock className="size-3" style={{ color: c.muted }} />
                    <p className="text-[10px]" style={{ color: c.muted }}>{time}</p>
                  </div>
                )}
                {eventDate?.trim() && (
                  <button
                    type="button"
                    onClick={handleAddToCalendar}
                    className="mt-4 flex w-full items-center justify-center gap-1.5 border px-3 py-2 text-[10px] font-medium transition-colors hover:opacity-90"
                    style={{ borderColor: c.accent + "40", color: c.text, borderRadius: d.borderRadius }}
                  >
                    <CalendarPlus className="size-3.5" style={{ color: c.accent }} />
                    {t("addToCalendar", "Add to Calendar")}
                  </button>
                )}
              </div>

              {/* Venue */}
              <div ref={registerRef("venue")} data-section="venue" className={cn("flex min-h-full w-full flex-col justify-center px-6 py-10", sectionAlign)}>
                <AccentIcon shape={d.accentShape} color={c.accent}>
                  <MapPin className="size-5" style={{ color: c.text }} />
                </AccentIcon>
                <h3 className={cn("mt-3 text-[10px] font-semibold uppercase tracking-[0.2em]", headingClass)} style={{ color: c.text }}>{t("venue", "Venue")}</h3>
                <Divider style={d.divider} color={c.accent} />
                <p className="text-xs font-medium" style={{ color: c.text }}>{venue}</p>
                <p className="mt-1 max-w-[190px] text-[10px] leading-relaxed" style={{ color: c.muted }}>{address}</p>
                {(hasGoogleMaps || hasWaze) && (
                  <div className="mt-4 flex gap-2">
                    {hasGoogleMaps && (
                      <a
                        href={googleMapsLink!.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 border px-2.5 py-1 text-[9px] font-medium transition-colors hover:opacity-80"
                        style={{ borderColor: c.accent + "40", color: c.text, borderRadius: d.borderRadius }}
                      >
                        <SiGooglemaps className="size-2.5" /> {t("maps", "Maps")}
                      </a>
                    )}
                    {hasWaze && (
                      <a
                        href={wazeLink!.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 border px-2.5 py-1 text-[9px] font-medium transition-colors hover:opacity-80"
                        style={{ borderColor: c.accent + "40", color: c.text, borderRadius: d.borderRadius }}
                      >
                        <SiWaze className="size-2.5" /> {t("waze", "Waze")}
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Gallery */}
              <div ref={registerRef("gallery")} data-section="gallery" className={cn("flex min-h-full w-full flex-col justify-center px-5 py-10", sectionAlign)}>
                <h3 className={cn("text-[10px] font-semibold uppercase tracking-[0.2em]", headingClass)} style={{ color: c.text }}>{t("gallery", "Gallery")}</h3>
                <Divider style={d.divider} color={c.accent} />
                <div className="grid w-full grid-cols-2 gap-1.5">
                  {(galleryPhotos && galleryPhotos.length > 0)
                    ? galleryPhotos.map((src, i) => (
                        <div
                          key={i}
                          className={cn("overflow-hidden", i === 0 && "col-span-2 aspect-[16/10]", i > 0 && "aspect-square")}
                          style={{ background: c.accent + "15", borderRadius: d.borderRadius }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt={`Photo ${i + 1}`} className="size-full object-cover" />
                        </div>
                      ))
                    : ["/templates/elegant-rose.svg", "/templates/golden-arch.svg", "/templates/sakura-bloom.svg", "/templates/rustic-kraft.svg"].map((src, i) => (
                        <div
                          key={i}
                          className={cn("overflow-hidden", i === 0 && "col-span-2 aspect-[16/10]", i > 0 && "aspect-square")}
                          style={{ background: c.accent + "15", borderRadius: d.borderRadius }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt={`Photo ${i + 1}`} className="size-full object-cover" />
                        </div>
                      ))}
                </div>
              </div>

              {/* Wishes */}
              {enableWishes && (
                <div ref={registerRef("wishes")} data-section="wishes" className={cn("flex min-h-full w-full flex-col justify-center px-5 py-10", sectionAlign)}>
                  <Heart className="size-4" style={{ color: c.text }} />
                  <h3 className={cn("mt-2 text-[10px] font-semibold uppercase tracking-[0.2em]", headingClass)} style={{ color: c.text }}>{t("wishes", "Wishes")}</h3>
                  <p className="mt-1 text-[9px]" style={{ color: c.muted }}>{t("visibleToAllGuests", "Visible to all guests")}</p>
                  <Divider style={d.divider} color={c.accent} />
                  <div className="flex w-full flex-col gap-2">
                    {[...(featuredWishes?.filter((w) => w.name?.trim() || w.message?.trim()) ?? []), ...guestWishes].map((w, i) => (
                      <div key={w.id ?? i} className="border px-3 py-2" style={{ borderColor: c.accent + "25", background: c.accent + "08", borderRadius: d.borderRadius }}>
                        <p className="text-[9px] font-semibold" style={{ color: c.text }}>{w.name?.trim() || "Guest"}</p>
                        <p className="mt-0.5 text-[9px] leading-relaxed" style={{ color: c.muted }}>{w.message?.trim()}</p>
                      </div>
                    ))}
                  </div>
                  {eventId && (
                    <>
                      <button
                        type="button"
                        onClick={() => setGuestWishes(loadGuestWishes(eventId))}
                        className="mt-3 self-center text-[9px] underline"
                        style={{ color: c.muted }}
                      >
                        {t("refresh", "Refresh")}
                      </button>
                      <WishesForm
                        eventId={eventId}
                        onWishSubmit={(wish) => {
                          const saved = saveGuestWish(eventId, wish)
                          setGuestWishes((prev) => [...prev, saved])
                        }}
                        colors={c}
                        design={d}
                      />
                    </>
                  )}
                </div>
              )}

              {/* RSVP */}
              <div ref={registerRef("rsvp")} data-section="rsvp" className={cn("flex min-h-full w-full flex-col justify-center px-6 py-10", sectionAlign)}>
                <Send className="size-4" style={{ color: c.text }} />
                <h3 className={cn("mt-3 text-[10px] font-semibold uppercase tracking-[0.2em]", headingClass)} style={{ color: c.text }}>{t("rsvp", "RSVP")}</h3>
                <Divider style={d.divider} color={c.accent} />
                <p className="max-w-[190px] text-[10px] leading-relaxed" style={{ color: c.muted }}>
                  {rsvpMessage?.trim() || t("rsvpDefaultMessage", "Please let us know if you can make it!")}
                </p>
                {rsvpDeadline?.trim() && (
                  <p className="mt-2 text-[9px]" style={{ color: c.muted }}>
                    {t("pleaseRespondBy", "Please respond by")} {formatRsvpDeadline(rsvpDeadline)}
                  </p>
                )}
                {eventId ? <RsvpSection eventId={eventId} guestRsvp={guestRsvp} onRsvpChange={setGuestRsvp} maxGuestsPerInvitee={maxGuestsPerInvitee} colors={c} design={d} /> : (
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 px-3 py-1.5 text-[10px] font-medium opacity-70" style={{ background: c.accent + "30", color: c.text, borderRadius: d.borderRadius }}>
                      {t("attending", "Attending")}
                    </button>
                    <button className="flex-1 border px-3 py-1.5 text-[10px] font-medium opacity-70" style={{ borderColor: c.accent + "40", color: c.text, borderRadius: d.borderRadius }}>
                      {t("notAttending", "Not Attending")}
                    </button>
                  </div>
                )}
              </div>

              <div className="h-8" />
            </>
          )}
          </InvitationRenderer>
        </div>

        {/* Bottom action bar */}
        {isOpened && (
          <div className="absolute bottom-3 left-1/2 z-30 -translate-x-1/2">
            <div className="flex items-center gap-0.5 rounded-full border border-border/50 px-1.5 py-1 shadow-lg backdrop-blur-sm" style={{ background: c.bg + "f0" }}>
              {[
                { icon: <Phone className="size-2.5" style={{ color: c.text }} />, label: t("call", "Call") },
                { icon: <Music className="size-2.5" style={{ color: c.text }} />, label: t("music", "Music") },
                { icon: <MapPin className="size-2.5" style={{ color: c.text }} />, label: t("map", "Map") },
                { icon: <Send className="size-2.5" style={{ color: c.text }} />, label: t("rsvp", "RSVP") },
              ].map((a) => (
                <button key={a.label} className="flex flex-col items-center gap-0.5 rounded-full px-2 py-1 transition-colors" style={{ color: c.muted }}>
                  {a.icon}
                  <span className="text-[6px] font-medium" style={{ color: c.muted }}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Next FAB */}
        {isOpened && activeSection !== "rsvp" && (
          <button
            onClick={goNext}
            className="absolute right-2.5 bottom-14 z-30 flex size-7 items-center justify-center rounded-full shadow-md transition-transform hover:scale-110 active:scale-95"
            style={{ background: c.text, color: c.bg }}
            aria-label="Next section"
          >
            <ChevronDown className="size-3" />
          </button>
        )}

        {/* Home indicator */}
        <div className="absolute bottom-1 left-1/2 h-1 w-[90px] -translate-x-1/2 rounded-full" style={{ background: c.muted + "30" }} />
      </div>

      {/* Info badges below phone */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
        {templateName && (
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-medium text-foreground">{templateName}</span>
        )}
        {backgroundMusic && (
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">Music On</span>
        )}
        {animatedEffect !== "none" && (
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">{animatedEffect}</span>
        )}
        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground capitalize">
          {packageType} &middot; {openingStyle}
        </span>
      </div>

      {/* Section dots */}
      {isOpened && (
        <div className="mt-2.5 flex items-center gap-1.5">
          {SECTIONS.filter((s) => s !== "gate").map((s) => (
            <button
              key={s}
              onClick={() => sectionRefs.current[s]?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className={cn("h-1 rounded-full transition-all", activeSection === s ? "w-4 bg-foreground" : "w-1.5 bg-foreground/20 hover:bg-foreground/40")}
              aria-label={`Go to ${s}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
