"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import {
  ChevronDown,
  Calendar,
  Clock,
  MapPin,
  Navigation,
  Heart,
  Send,
  Music,
  Phone,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { TemplateThemeColors, TemplateDesign } from "@/lib/templates"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface InvitationPreviewProps {
  templateId?: string
  templateName?: string
  templateThumbnail?: string
  colors?: TemplateThemeColors
  design?: TemplateDesign
  openingStyle: string
  animatedEffect: string
  language: string
  packageType: string
  backgroundMusic: boolean
  guestName: boolean
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
  coupleName,
  date,
  colors,
  design,
}: {
  onOpen: () => void
  coupleName: string
  date: string
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
          <p className="text-[8px] uppercase tracking-[0.35em]" style={{ color: colors.muted }}>{"You're invited"}</p>
          <h2
            className={cn("text-base", design.fontPairing === "serif" ? "font-serif" : "font-sans")}
            style={{ color: colors.text, fontWeight: design.headingWeight, letterSpacing: design.letterSpacing }}
          >
            {coupleName}
          </h2>
          <p className="text-[9px]" style={{ color: colors.muted }}>{date}</p>
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
  coupleName,
  date,
  colors,
  design,
}: {
  onOpen: () => void
  coupleName: string
  date: string
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
      <p className="mt-4 text-[8px] uppercase tracking-[0.35em]" style={{ color: colors.muted }}>{"You're invited"}</p>
      <h2
        className={cn("mt-3 text-lg leading-tight", design.fontPairing === "serif" ? "font-serif" : "font-sans")}
        style={{ color: colors.text, fontWeight: design.headingWeight, letterSpacing: design.letterSpacing }}
      >
        {coupleName}
      </h2>
      <p className="mt-2 text-[9px]" style={{ color: colors.muted }}>{date}</p>
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
/*  Section constants                                                  */
/* ------------------------------------------------------------------ */

const SECTIONS = ["gate", "hero", "datetime", "venue", "gallery", "wishes", "rsvp"] as const
type SectionId = (typeof SECTIONS)[number]

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function InvitationPreview({
  templateName,
  templateThumbnail,
  colors,
  design,
  openingStyle,
  animatedEffect,
  language,
  packageType,
  backgroundMusic,
  guestName,
  className,
}: InvitationPreviewProps) {
  const [isOpened, setIsOpened] = useState(false)
  const [activeSection, setActiveSection] = useState<SectionId>("gate")
  const [rsvpDone, setRsvpDone] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Partial<Record<SectionId, HTMLDivElement | null>>>({})

  useEffect(() => {
    setIsOpened(false)
    setActiveSection("gate")
    setRsvpDone(false)
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [openingStyle])

  const c: TemplateThemeColors = colors || { bg: "#faf8f5", text: "#1c1917", accent: "#a68a6b", muted: "#78716c" }
  const d: TemplateDesign = design || {
    fontPairing: "serif", headingWeight: "400", letterSpacing: "0.04em",
    decorator: "line-minimal", heroLayout: "centered", divider: "line",
    bgPattern: null, borderRadius: "12px", accentShape: "circle",
  }

  const coupleName = "Sarah & Ahmed"
  const date = "Saturday, March 15, 2026"
  const time = "6:00 PM - 11:00 PM"
  const venue = "The Grand Pavilion"
  const address = "123 Garden Boulevard, Kuala Lumpur"

  const inviteLabel = language === "arabic" ? "\u0623\u0646\u062A \u0645\u062F\u0639\u0648" : language === "french" ? "Vous \u00EAtes invit\u00E9" : "You are invited"
  const ceremonyLabel = language === "arabic" ? "\u062D\u0641\u0644 \u0632\u0641\u0627\u0641" : language === "french" ? "C\u00E9r\u00E9monie" : "Wedding Ceremony"

  const headingClass = d.fontPairing === "serif" ? "font-serif" : "font-sans"
  const headingStyle = { color: c.text, fontWeight: d.headingWeight, letterSpacing: d.letterSpacing }

  const handleGateOpen = useCallback(() => {
    setIsOpened(true)
    setActiveSection("hero")
    setTimeout(() => { sectionRefs.current.hero?.scrollIntoView({ behavior: "smooth", block: "start" }) }, 100)
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
          {/* Template decorator overlay */}
          {isOpened && <Decorator type={d.decorator} color={c.accent} />}

          {/* Animated effects */}
          {showEffect && animatedEffect === "Floating Dots" && <FloatingDots color={c.accent} />}
          {showEffect && animatedEffect === "Confetti" && <ConfettiEffect />}

          {/* Opening gate */}
          {!isOpened && openingStyle === "Window" && (
            <WindowGate onOpen={handleGateOpen} coupleName={coupleName} date={date} colors={c} design={d} />
          )}
          {!isOpened && openingStyle !== "Window" && (
            <CircleGate onOpen={handleGateOpen} coupleName={coupleName} date={date} colors={c} design={d} />
          )}

          {/* Scrollable sections */}
          {isOpened && (
            <>
              {/* Hero */}
              <div
                ref={registerRef("hero")}
                data-section="hero"
                className={cn("flex min-h-full w-full flex-col justify-center px-6 py-10", sectionAlign)}
              >
                {templateThumbnail && (
                  <div
                    className="mb-4 size-16 overflow-hidden border-2"
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
                <p className="mt-4 text-[8px] uppercase tracking-[0.3em]" style={{ color: c.muted }}>{inviteLabel}</p>
                <h2 className={cn("mt-3 text-lg", headingClass)} style={headingStyle}>{coupleName}</h2>
                <Divider style={d.divider} color={c.accent} />
                <p className="text-[9px] uppercase tracking-[0.2em]" style={{ color: c.muted }}>{ceremonyLabel}</p>
                {guestName && (
                  <div className="mt-4 border px-4 py-1" style={{ borderColor: c.accent + "40", borderRadius: d.borderRadius }}>
                    <p className="text-[8px] uppercase tracking-[0.12em]" style={{ color: c.muted }}>Dear Guest Name</p>
                  </div>
                )}
              </div>

              {/* Date & Time */}
              <div ref={registerRef("datetime")} data-section="datetime" className={cn("flex min-h-full w-full flex-col justify-center px-6 py-10", sectionAlign)}>
                <AccentIcon shape={d.accentShape} color={c.accent}>
                  <Calendar className="size-5" style={{ color: c.text }} />
                </AccentIcon>
                <h3 className={cn("mt-3 text-[10px] font-semibold uppercase tracking-[0.2em]", headingClass)} style={{ color: c.text }}>Save the Date</h3>
                <Divider style={d.divider} color={c.accent} />
                <p className="text-xs font-medium" style={{ color: c.text }}>{date}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <Clock className="size-3" style={{ color: c.muted }} />
                  <p className="text-[10px]" style={{ color: c.muted }}>{time}</p>
                </div>
              </div>

              {/* Venue */}
              <div ref={registerRef("venue")} data-section="venue" className={cn("flex min-h-full w-full flex-col justify-center px-6 py-10", sectionAlign)}>
                <AccentIcon shape={d.accentShape} color={c.accent}>
                  <MapPin className="size-5" style={{ color: c.text }} />
                </AccentIcon>
                <h3 className={cn("mt-3 text-[10px] font-semibold uppercase tracking-[0.2em]", headingClass)} style={{ color: c.text }}>Venue</h3>
                <Divider style={d.divider} color={c.accent} />
                <p className="text-xs font-medium" style={{ color: c.text }}>{venue}</p>
                <p className="mt-1 max-w-[190px] text-[10px] leading-relaxed" style={{ color: c.muted }}>{address}</p>
                <div className="mt-4 flex gap-2">
                  <button className="flex items-center gap-1 border px-2.5 py-1 text-[9px] font-medium transition-colors hover:opacity-80" style={{ borderColor: c.accent + "40", color: c.text, borderRadius: d.borderRadius }}>
                    <Navigation className="size-2.5" /> Maps
                  </button>
                  <button className="flex items-center gap-1 border px-2.5 py-1 text-[9px] font-medium transition-colors hover:opacity-80" style={{ borderColor: c.accent + "40", color: c.text, borderRadius: d.borderRadius }}>
                    <Navigation className="size-2.5" /> Waze
                  </button>
                </div>
              </div>

              {/* Gallery */}
              <div ref={registerRef("gallery")} data-section="gallery" className={cn("flex min-h-full w-full flex-col justify-center px-5 py-10", sectionAlign)}>
                <h3 className={cn("text-[10px] font-semibold uppercase tracking-[0.2em]", headingClass)} style={{ color: c.text }}>Gallery</h3>
                <Divider style={d.divider} color={c.accent} />
                <div className="grid w-full grid-cols-2 gap-1.5">
                  {["/templates/elegant-rose.jpg", "/templates/golden-arch.jpg", "/templates/sakura-bloom.jpg", "/templates/rustic-kraft.jpg"].map((src, i) => (
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
              <div ref={registerRef("wishes")} data-section="wishes" className={cn("flex min-h-full w-full flex-col justify-center px-5 py-10", sectionAlign)}>
                <Heart className="size-4" style={{ color: c.text }} />
                <h3 className={cn("mt-2 text-[10px] font-semibold uppercase tracking-[0.2em]", headingClass)} style={{ color: c.text }}>Wishes</h3>
                <Divider style={d.divider} color={c.accent} />
                <div className="flex w-full flex-col gap-2">
                  {[
                    { name: "Aminah", message: "Wishing you both a lifetime of love!" },
                    { name: "Rizal", message: "Congratulations on your special day!" },
                    { name: "Fatimah", message: "So happy for you both. Best wishes!" },
                  ].map((w, i) => (
                    <div key={i} className="border px-3 py-2" style={{ borderColor: c.accent + "25", background: c.accent + "08", borderRadius: d.borderRadius }}>
                      <p className="text-[9px] font-semibold" style={{ color: c.text }}>{w.name}</p>
                      <p className="mt-0.5 text-[9px] leading-relaxed" style={{ color: c.muted }}>{w.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* RSVP */}
              <div ref={registerRef("rsvp")} data-section="rsvp" className={cn("flex min-h-full w-full flex-col justify-center px-6 py-10", sectionAlign)}>
                <Send className="size-4" style={{ color: c.text }} />
                <h3 className={cn("mt-3 text-[10px] font-semibold uppercase tracking-[0.2em]", headingClass)} style={{ color: c.text }}>RSVP</h3>
                <Divider style={d.divider} color={c.accent} />
                <p className="max-w-[190px] text-[10px] leading-relaxed" style={{ color: c.muted }}>Please let us know if you can make it!</p>
                {rsvpDone ? (
                  <div className="mt-4 border px-4 py-2" style={{ borderColor: c.accent + "30", background: c.accent + "10", borderRadius: d.borderRadius }}>
                    <p className="text-[10px] font-medium" style={{ color: c.text }}>Thank you!</p>
                  </div>
                ) : (
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => setRsvpDone(true)} className="px-3 py-1.5 text-[10px] font-medium transition-colors" style={{ background: c.text, color: c.bg, borderRadius: d.borderRadius }}>
                      Attending
                    </button>
                    <button onClick={() => setRsvpDone(true)} className="border px-3 py-1.5 text-[10px] font-medium transition-colors" style={{ borderColor: c.accent + "40", color: c.text, borderRadius: d.borderRadius }}>
                      Not Attending
                    </button>
                  </div>
                )}
              </div>

              <div className="h-8" />
            </>
          )}
        </div>

        {/* Bottom action bar */}
        {isOpened && (
          <div className="absolute bottom-3 left-1/2 z-30 -translate-x-1/2">
            <div className="flex items-center gap-0.5 rounded-full border border-border/50 px-1.5 py-1 shadow-lg backdrop-blur-sm" style={{ background: c.bg + "f0" }}>
              {[
                { icon: <Phone className="size-2.5" style={{ color: c.text }} />, label: "Call" },
                { icon: <Music className="size-2.5" style={{ color: c.text }} />, label: "Music" },
                { icon: <MapPin className="size-2.5" style={{ color: c.text }} />, label: "Map" },
                { icon: <Send className="size-2.5" style={{ color: c.text }} />, label: "RSVP" },
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
