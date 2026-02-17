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
import type { TemplateThemeColors } from "@/lib/templates"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface InvitationPreviewProps {
  templateId?: string
  templateName?: string
  templateThumbnail?: string
  colors?: TemplateThemeColors
  openingStyle: string
  animatedEffect: string
  language: string
  packageType: string
  backgroundMusic: boolean
  guestName: boolean
  className?: string
}

/* ------------------------------------------------------------------ */
/*  Floating dots effect                                               */
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
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 0.3; }
          100% { transform: translateY(-18px) scale(1.3); opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Confetti effect                                                    */
/* ------------------------------------------------------------------ */

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
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.9; }
          100% { transform: translateY(600px) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Window (two-panel split) opening gate                              */
/* ------------------------------------------------------------------ */

function WindowGate({
  onOpen,
  coupleName,
  date,
  colors,
}: {
  onOpen: () => void
  coupleName: string
  date: string
  colors: TemplateThemeColors
}) {
  const [opened, setOpened] = useState(false)

  function handleOpen() {
    setOpened(true)
    setTimeout(onOpen, 600)
  }

  return (
    <div className="absolute inset-0 z-30 overflow-hidden" style={{ background: colors.bg }}>
      {/* Left panel */}
      <div
        className="absolute inset-y-0 left-0 w-1/2 border-r transition-transform duration-600 ease-in-out"
        style={{
          background: colors.bg,
          borderColor: colors.accent + "30",
          transform: opened ? "translateX(-100%)" : "translateX(0)",
        }}
      >
        <div className="flex h-full items-center justify-end pr-2">
          <div className="h-20 w-px" style={{ background: colors.accent + "40" }} />
        </div>
      </div>
      {/* Right panel */}
      <div
        className="absolute inset-y-0 right-0 w-1/2 border-l transition-transform duration-600 ease-in-out"
        style={{
          background: colors.bg,
          borderColor: colors.accent + "30",
          transform: opened ? "translateX(100%)" : "translateX(0)",
        }}
      >
        <div className="flex h-full items-center justify-start pl-2">
          <div className="h-20 w-px" style={{ background: colors.accent + "40" }} />
        </div>
      </div>
      {/* Center content */}
      {!opened && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 text-center">
          <p className="text-[8px] uppercase tracking-[0.35em]" style={{ color: colors.muted }}>
            {"You're invited"}
          </p>
          <h2 className="font-serif text-base font-semibold" style={{ color: colors.text }}>
            {coupleName}
          </h2>
          <p className="text-[9px]" style={{ color: colors.muted }}>{date}</p>
          <button
            onClick={handleOpen}
            className="mt-1 rounded-full px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] transition-transform hover:scale-105 active:scale-95"
            style={{ background: colors.text, color: colors.bg }}
          >
            Open
          </button>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Circle gate opening                                                */
/* ------------------------------------------------------------------ */

function CircleGate({
  onOpen,
  coupleName,
  date,
  colors,
}: {
  onOpen: () => void
  coupleName: string
  date: string
  colors: TemplateThemeColors
}) {
  const [opened, setOpened] = useState(false)

  function handleOpen() {
    setOpened(true)
    setTimeout(onOpen, 500)
  }

  return (
    <div
      className={cn(
        "absolute inset-0 z-30 flex flex-col items-center justify-center transition-all duration-500",
        opened && "pointer-events-none scale-150 opacity-0"
      )}
      style={{ background: colors.bg }}
    >
      <div className="h-px w-10" style={{ background: colors.accent }} />
      <p className="mt-4 text-[8px] uppercase tracking-[0.35em]" style={{ color: colors.muted }}>
        {"You're invited"}
      </p>
      <h2 className="mt-3 font-serif text-lg font-semibold leading-tight" style={{ color: colors.text }}>
        {coupleName}
      </h2>
      <p className="mt-2 text-[9px]" style={{ color: colors.muted }}>{date}</p>
      <button
        onClick={handleOpen}
        className="mt-5 flex size-14 items-center justify-center rounded-full border-2 transition-transform hover:scale-105 active:scale-95"
        style={{
          background: colors.text,
          color: colors.bg,
          borderColor: colors.accent + "40",
        }}
      >
        <span className="text-[9px] font-semibold uppercase tracking-[0.15em]">Open</span>
      </button>
      <ChevronDown className="mt-3 size-3.5 animate-bounce" style={{ color: colors.muted + "60" }} />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Section helpers                                                    */
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

  // Reset state when opening style changes
  useEffect(() => {
    setIsOpened(false)
    setActiveSection("gate")
    setRsvpDone(false)
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [openingStyle])

  const c: TemplateThemeColors = colors || {
    bg: "#faf8f5",
    text: "#1c1917",
    accent: "#a68a6b",
    muted: "#78716c",
  }

  const coupleName = "Sarah & Ahmed"
  const date = "Saturday, March 15, 2026"
  const time = "6:00 PM - 11:00 PM"
  const venue = "The Grand Pavilion"
  const address = "123 Garden Boulevard, Kuala Lumpur"

  const inviteLabel =
    language === "arabic" ? "\u0623\u0646\u062A \u0645\u062F\u0639\u0648" :
    language === "french" ? "Vous \u00EAtes invit\u00E9" :
    "You are invited"

  const ceremonyLabel =
    language === "arabic" ? "\u062D\u0641\u0644 \u0632\u0641\u0627\u0641" :
    language === "french" ? "C\u00E9r\u00E9monie" :
    "Wedding Ceremony"

  const handleGateOpen = useCallback(() => {
    setIsOpened(true)
    setActiveSection("hero")
    setTimeout(() => {
      sectionRefs.current.hero?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }, [])

  // Intersection observer for tracking current section
  useEffect(() => {
    const container = scrollRef.current
    if (!container || !isOpened) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-section") as SectionId | null
            if (id) setActiveSection(id)
          }
        }
      },
      { root: container, threshold: 0.5 }
    )

    for (const id of SECTIONS) {
      const el = sectionRefs.current[id]
      if (el && id !== "gate") observer.observe(el)
    }

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

  const registerRef = (id: SectionId) => (el: HTMLDivElement | null) => {
    sectionRefs.current[id] = el
  }

  const showEffect = isOpened && animatedEffect !== "none"

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Phone frame */}
      <div className="relative mx-auto w-[280px] rounded-[42px] border-[6px] border-foreground/90 bg-foreground/90 shadow-2xl">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 z-40 h-6 w-[100px] -translate-x-1/2 rounded-b-2xl bg-foreground/90" />

        {/* Screen */}
        <div
          ref={scrollRef}
          className="relative aspect-[9/19.5] w-full overflow-y-auto overflow-x-hidden rounded-[36px] scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ background: c.bg }}
        >
          {/* Animated effects layer */}
          {showEffect && animatedEffect === "Floating Dots" && <FloatingDots color={c.accent} />}
          {showEffect && animatedEffect === "Confetti" && <ConfettiEffect />}

          {/* Opening gate */}
          {!isOpened && openingStyle === "Window" && (
            <WindowGate onOpen={handleGateOpen} coupleName={coupleName} date={date} colors={c} />
          )}
          {!isOpened && openingStyle !== "Window" && (
            <CircleGate onOpen={handleGateOpen} coupleName={coupleName} date={date} colors={c} />
          )}

          {/* ---- Scrollable sections (after opening) ---- */}
          {isOpened && (
            <>
              {/* Hero */}
              <div
                ref={registerRef("hero")}
                data-section="hero"
                className="flex min-h-full w-full flex-col items-center justify-center px-6 py-10 text-center"
              >
                {templateThumbnail && (
                  <div className="mb-4 size-16 overflow-hidden rounded-full border-2" style={{ borderColor: c.accent + "40" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={templateThumbnail} alt="" className="size-full object-cover" />
                  </div>
                )}
                <div className="h-px w-10" style={{ background: c.accent }} />
                <p className="mt-4 text-[8px] uppercase tracking-[0.3em]" style={{ color: c.muted }}>
                  {inviteLabel}
                </p>
                <h2 className="mt-3 font-serif text-lg font-semibold" style={{ color: c.text }}>
                  {coupleName}
                </h2>
                <div className="my-4 h-px w-7" style={{ background: c.accent }} />
                <p className="text-[9px] uppercase tracking-[0.2em]" style={{ color: c.muted }}>
                  {ceremonyLabel}
                </p>
                {guestName && (
                  <div className="mt-4 rounded-full border px-4 py-1" style={{ borderColor: c.accent + "40" }}>
                    <p className="text-[8px] uppercase tracking-[0.12em]" style={{ color: c.muted }}>
                      Dear Guest Name
                    </p>
                  </div>
                )}
              </div>

              {/* Date & Time */}
              <div
                ref={registerRef("datetime")}
                data-section="datetime"
                className="flex min-h-full w-full flex-col items-center justify-center px-6 py-10 text-center"
              >
                <div className="rounded-full border p-3" style={{ borderColor: c.accent + "30" }}>
                  <Calendar className="size-5" style={{ color: c.text }} />
                </div>
                <h3 className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: c.text }}>
                  Save the Date
                </h3>
                <div className="my-3 h-px w-7" style={{ background: c.accent }} />
                <p className="text-xs font-medium" style={{ color: c.text }}>{date}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <Clock className="size-3" style={{ color: c.muted }} />
                  <p className="text-[10px]" style={{ color: c.muted }}>{time}</p>
                </div>
              </div>

              {/* Venue */}
              <div
                ref={registerRef("venue")}
                data-section="venue"
                className="flex min-h-full w-full flex-col items-center justify-center px-6 py-10 text-center"
              >
                <div className="rounded-full border p-3" style={{ borderColor: c.accent + "30" }}>
                  <MapPin className="size-5" style={{ color: c.text }} />
                </div>
                <h3 className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: c.text }}>
                  Venue
                </h3>
                <div className="my-3 h-px w-7" style={{ background: c.accent }} />
                <p className="text-xs font-medium" style={{ color: c.text }}>{venue}</p>
                <p className="mt-1 max-w-[190px] text-[10px] leading-relaxed" style={{ color: c.muted }}>
                  {address}
                </p>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="h-6 gap-1 text-[9px]">
                    <Navigation className="size-2.5" /> Maps
                  </Button>
                  <Button variant="outline" size="sm" className="h-6 gap-1 text-[9px]">
                    <Navigation className="size-2.5" /> Waze
                  </Button>
                </div>
              </div>

              {/* Gallery */}
              <div
                ref={registerRef("gallery")}
                data-section="gallery"
                className="flex min-h-full w-full flex-col items-center justify-center px-5 py-10"
              >
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: c.text }}>
                  Gallery
                </h3>
                <div className="my-3 h-px w-7" style={{ background: c.accent }} />
                <div className="grid w-full grid-cols-2 gap-1.5">
                  {[
                    "/templates/elegant-rose.jpg",
                    "/templates/golden-arch.jpg",
                    "/templates/sakura-bloom.jpg",
                    "/templates/rustic-kraft.jpg",
                  ].map((src, i) => (
                    <div
                      key={i}
                      className={cn(
                        "overflow-hidden rounded-lg",
                        i === 0 && "col-span-2 aspect-[16/10]",
                        i > 0 && "aspect-square"
                      )}
                      style={{ background: c.accent + "15" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={`Photo ${i + 1}`} className="size-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Wishes */}
              <div
                ref={registerRef("wishes")}
                data-section="wishes"
                className="flex min-h-full w-full flex-col items-center justify-center px-5 py-10"
              >
                <Heart className="size-4" style={{ color: c.text }} />
                <h3 className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: c.text }}>
                  Wishes
                </h3>
                <div className="my-3 h-px w-7" style={{ background: c.accent }} />
                <div className="flex w-full flex-col gap-2">
                  {[
                    { name: "Aminah", message: "Wishing you both a lifetime of love!" },
                    { name: "Rizal", message: "Congratulations on your special day!" },
                    { name: "Fatimah", message: "So happy for you both. Best wishes!" },
                  ].map((w, i) => (
                    <Card key={i} className="border shadow-none" style={{ borderColor: c.accent + "25", background: c.accent + "08" }}>
                      <CardContent className="px-3 py-2">
                        <p className="text-[9px] font-semibold" style={{ color: c.text }}>{w.name}</p>
                        <p className="mt-0.5 text-[9px] leading-relaxed" style={{ color: c.muted }}>{w.message}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* RSVP */}
              <div
                ref={registerRef("rsvp")}
                data-section="rsvp"
                className="flex min-h-full w-full flex-col items-center justify-center px-6 py-10 text-center"
              >
                <Send className="size-4" style={{ color: c.text }} />
                <h3 className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: c.text }}>
                  RSVP
                </h3>
                <div className="my-3 h-px w-7" style={{ background: c.accent }} />
                <p className="max-w-[190px] text-[10px] leading-relaxed" style={{ color: c.muted }}>
                  Please let us know if you can make it!
                </p>
                {rsvpDone ? (
                  <div className="mt-4 rounded-lg border px-4 py-2" style={{ borderColor: c.accent + "30", background: c.accent + "10" }}>
                    <p className="text-[10px] font-medium" style={{ color: c.text }}>Thank you!</p>
                  </div>
                ) : (
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" className="h-7 text-[10px]" onClick={() => setRsvpDone(true)}>
                      Attending
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => setRsvpDone(true)}>
                      Not Attending
                    </Button>
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
            <div className="flex items-center gap-0.5 rounded-full border border-border/50 bg-card/95 px-1.5 py-1 shadow-lg backdrop-blur-sm">
              {[
                { icon: <Phone className="size-2.5" />, label: "Call" },
                { icon: <Music className="size-2.5" />, label: "Music" },
                { icon: <MapPin className="size-2.5" />, label: "Map" },
                { icon: <Send className="size-2.5" />, label: "RSVP" },
              ].map((a) => (
                <button key={a.label} className="flex flex-col items-center gap-0.5 rounded-full px-2 py-1 hover:bg-secondary">
                  {a.icon}
                  <span className="text-[6px] font-medium text-muted-foreground">{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Next FAB */}
        {isOpened && activeSection !== "rsvp" && (
          <button
            onClick={goNext}
            className="absolute right-2.5 bottom-14 z-30 flex size-7 items-center justify-center rounded-full bg-foreground text-primary-foreground shadow-md transition-transform hover:scale-110 active:scale-95"
            aria-label="Next section"
          >
            <ChevronDown className="size-3" />
          </button>
        )}

        {/* Home indicator */}
        <div className="absolute bottom-1 left-1/2 h-1 w-[90px] -translate-x-1/2 rounded-full bg-muted-foreground/30" />
      </div>

      {/* Info badges below phone */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
        {templateName && (
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-medium text-foreground">
            {templateName}
          </span>
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
              className={cn(
                "h-1 rounded-full transition-all",
                activeSection === s ? "w-4 bg-foreground" : "w-1.5 bg-foreground/20 hover:bg-foreground/40"
              )}
              aria-label={`Go to ${s}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
