"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import {
  Phone,
  Music,
  MapPin,
  Heart,
  ChevronDown,
  Calendar,
  Clock,
  Navigation,
  Send,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface InvitationData {
  title: string
  subtitle?: string
  coupleName?: string
  date: string
  time: string
  venueName: string
  address: string
  galleryImages: string[]
  wishes: { name: string; message: string }[]
  themeColor: string
  accentColor: string
}

interface InteractiveInvitationPreviewProps {
  data?: InvitationData
  autoScrollDelay?: number
  className?: string
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const DEFAULT_DATA: InvitationData = {
  title: "Wedding Celebration",
  subtitle: "Together with their families",
  coupleName: "Sarah & Ahmed",
  date: "Saturday, March 15, 2026",
  time: "6:00 PM - 11:00 PM",
  venueName: "The Grand Pavilion",
  address: "123 Garden Boulevard, Kuala Lumpur",
  galleryImages: [
    "/templates/elegant-rose.jpg",
    "/templates/golden-arch.jpg",
    "/templates/sakura-bloom.jpg",
    "/templates/midnight-garden.jpg",
    "/templates/rustic-kraft.jpg",
    "/templates/islamic-geometric.jpg",
  ],
  wishes: [
    { name: "Aminah", message: "Wishing you both a lifetime of love and happiness!" },
    { name: "Rizal", message: "Congratulations! May your journey together be beautiful." },
    { name: "Fatimah", message: "So happy for you both. Best wishes always!" },
  ],
  themeColor: "oklch(0.175 0.015 56)",
  accentColor: "oklch(0.70 0.10 45)",
}

/* ------------------------------------------------------------------ */
/*  Section IDs                                                        */
/* ------------------------------------------------------------------ */

const SECTIONS = ["cover", "hero", "datetime", "venue", "gallery", "wishes", "rsvp"] as const
type SectionId = (typeof SECTIONS)[number]

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function InteractiveInvitationPreview({
  data = DEFAULT_DATA,
  autoScrollDelay = 1200,
  className,
}: InteractiveInvitationPreviewProps) {
  const [isOpened, setIsOpened] = useState(false)
  const [currentSection, setCurrentSection] = useState<SectionId>("cover")
  const [isAutoScrolling, setIsAutoScrolling] = useState(false)
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Record<SectionId, HTMLDivElement | null>>({
    cover: null,
    hero: null,
    datetime: null,
    venue: null,
    gallery: null,
    wishes: null,
    rsvp: null,
  })

  const scrollToSection = useCallback(
    (id: SectionId) => {
      const el = sectionRefs.current[id]
      if (el && scrollRef.current) {
        setIsAutoScrolling(true)
        el.scrollIntoView({ behavior: "smooth", block: "start" })
        setCurrentSection(id)
        setTimeout(() => setIsAutoScrolling(false), 800)
      }
    },
    []
  )

  const handleOpen = useCallback(() => {
    setIsOpened(true)
    setTimeout(() => scrollToSection("hero"), 400)
  }, [scrollToSection])

  /* Track which section is in view via IntersectionObserver */
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (isAutoScrolling) return
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-section") as SectionId | null
            if (id) setCurrentSection(id)
          }
        }
      },
      { root: container, threshold: 0.55 }
    )

    for (const id of SECTIONS) {
      const el = sectionRefs.current[id]
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [isOpened, isAutoScrolling])

  /* Keyboard shortcut for next section */
  const goNextSection = useCallback(() => {
    const idx = SECTIONS.indexOf(currentSection)
    if (idx < SECTIONS.length - 1) {
      scrollToSection(SECTIONS[idx + 1])
    }
  }, [currentSection, scrollToSection])

  const registerRef = (id: SectionId) => (el: HTMLDivElement | null) => {
    sectionRefs.current[id] = el
  }

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      {/* Phone frame */}
      <div className="relative mx-auto w-[300px] rounded-[44px] border-[6px] border-foreground/90 bg-foreground/90 shadow-2xl">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 z-20 h-7 w-[120px] -translate-x-1/2 rounded-b-2xl bg-foreground/90" />

        {/* Screen */}
        <div
          ref={scrollRef}
          className="relative aspect-[9/19.5] w-full overflow-y-auto overflow-x-hidden rounded-[38px] bg-card scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {/* ---- COVER / INTRO GATE ---- */}
          <div
            ref={registerRef("cover")}
            data-section="cover"
            className={cn(
              "relative flex min-h-full w-full flex-col items-center justify-center px-6 transition-opacity duration-500",
              isOpened && "pointer-events-none opacity-0"
            )}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--secondary)_0%,var(--card)_70%)]" />

            <div className="relative z-10 flex flex-col items-center gap-6 text-center">
              <div className="h-px w-12 bg-accent" />

              <p className="text-[9px] uppercase tracking-[0.35em] text-muted-foreground">
                {"You're invited"}
              </p>

              <h1 className="font-serif text-lg font-semibold leading-tight tracking-tight text-foreground">
                {data.coupleName || data.title}
              </h1>

              <p className="text-[10px] leading-relaxed text-muted-foreground">
                {data.date}
              </p>

              <button
                onClick={handleOpen}
                className="group mt-2 flex size-16 cursor-pointer items-center justify-center rounded-full border-2 border-foreground/20 bg-foreground text-primary-foreground transition-all hover:scale-105 hover:border-foreground/40 active:scale-95"
                aria-label="Open invitation"
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
                  Open
                </span>
              </button>

              <ChevronDown className="mt-2 size-4 animate-bounce text-muted-foreground/50" />
            </div>
          </div>

          {/* Scrollable content (visible after opening) */}
          {isOpened && (
            <>
              {/* ---- HERO ---- */}
              <div
                ref={registerRef("hero")}
                data-section="hero"
                className="flex min-h-full w-full flex-col items-center justify-center px-6 py-10 text-center"
              >
                <div className="h-px w-10 bg-accent" />
                <p className="mt-5 text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                  {data.subtitle || "Together with their families"}
                </p>
                <h2 className="mt-4 font-serif text-xl font-semibold tracking-tight text-foreground">
                  {data.coupleName || data.title}
                </h2>
                <div className="my-5 h-px w-8 bg-accent" />
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  {data.title}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  We joyfully invite you to share in our celebration of love
                </p>
              </div>

              {/* ---- DATE & TIME ---- */}
              <div
                ref={registerRef("datetime")}
                data-section="datetime"
                className="flex min-h-full w-full flex-col items-center justify-center px-6 py-10 text-center"
              >
                <div className="rounded-full border border-border p-3">
                  <Calendar className="size-5 text-foreground" />
                </div>
                <h3 className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
                  Save the Date
                </h3>
                <div className="my-4 h-px w-8 bg-accent" />
                <p className="text-sm font-medium text-foreground">{data.date}</p>
                <div className="mt-3 flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="size-3" />
                  <p className="text-[11px]">{data.time}</p>
                </div>
              </div>

              {/* ---- VENUE ---- */}
              <div
                ref={registerRef("venue")}
                data-section="venue"
                className="flex min-h-full w-full flex-col items-center justify-center px-6 py-10 text-center"
              >
                <div className="rounded-full border border-border p-3">
                  <MapPin className="size-5 text-foreground" />
                </div>
                <h3 className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
                  Venue
                </h3>
                <div className="my-4 h-px w-8 bg-accent" />
                <p className="text-sm font-medium text-foreground">{data.venueName}</p>
                <p className="mt-1.5 max-w-[200px] text-[11px] leading-relaxed text-muted-foreground">
                  {data.address}
                </p>
                <div className="mt-5 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 text-[10px]"
                    onClick={() => {}}
                  >
                    <Navigation className="size-3" />
                    Google Maps
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 text-[10px]"
                    onClick={() => {}}
                  >
                    <Navigation className="size-3" />
                    Waze
                  </Button>
                </div>
              </div>

              {/* ---- GALLERY ---- */}
              <div
                ref={registerRef("gallery")}
                data-section="gallery"
                className="flex min-h-full w-full flex-col items-center justify-center px-5 py-10"
              >
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
                  Gallery
                </h3>
                <div className="my-4 h-px w-8 bg-accent" />
                <div className="grid w-full grid-cols-2 gap-1.5">
                  {data.galleryImages.slice(0, 6).map((src, i) => (
                    <div
                      key={i}
                      className={cn(
                        "overflow-hidden rounded-lg bg-secondary",
                        i === 0 && "col-span-2 aspect-[16/10]",
                        i > 0 && "aspect-square"
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`Gallery ${i + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* ---- WISHES ---- */}
              <div
                ref={registerRef("wishes")}
                data-section="wishes"
                className="flex min-h-full w-full flex-col items-center justify-center px-5 py-10"
              >
                <Heart className="size-4 text-foreground" />
                <h3 className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
                  Wishes
                </h3>
                <div className="my-4 h-px w-8 bg-accent" />
                <div className="flex w-full flex-col gap-2.5">
                  {data.wishes.map((wish, i) => (
                    <Card key={i} className="border-border bg-secondary/50 shadow-none">
                      <CardContent className="px-3.5 py-3">
                        <p className="text-[10px] font-semibold text-foreground">
                          {wish.name}
                        </p>
                        <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
                          {wish.message}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* ---- RSVP ---- */}
              <div
                ref={registerRef("rsvp")}
                data-section="rsvp"
                className="flex min-h-full w-full flex-col items-center justify-center px-6 py-10 text-center"
              >
                <Send className="size-5 text-foreground" />
                <h3 className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
                  RSVP
                </h3>
                <div className="my-4 h-px w-8 bg-accent" />
                <p className="max-w-[200px] text-[11px] leading-relaxed text-muted-foreground">
                  Please let us know if you can make it. We would love to celebrate with you!
                </p>
                {rsvpSubmitted ? (
                  <div className="mt-5 rounded-lg border border-border bg-secondary/50 px-5 py-3">
                    <p className="text-[11px] font-medium text-foreground">
                      Thank you for your response!
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 flex gap-2">
                    <Button
                      size="sm"
                      className="h-8 gap-1.5 text-[11px]"
                      onClick={() => setRsvpSubmitted(true)}
                    >
                      Attending
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-[11px]"
                      onClick={() => setRsvpSubmitted(true)}
                    >
                      Not Attending
                    </Button>
                  </div>
                )}
              </div>

              {/* Bottom spacer for scroll snapping */}
              <div className="h-8" />
            </>
          )}
        </div>

        {/* Sticky bottom action bar (visible after opening) */}
        {isOpened && (
          <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2">
            <div className="flex items-center gap-1 rounded-full border border-border/60 bg-card/95 px-2 py-1.5 shadow-lg backdrop-blur-sm">
              <ActionButton
                icon={<Phone className="size-3" />}
                label="Call"
                onClick={() => {}}
              />
              <ActionButton
                icon={<Music className="size-3" />}
                label="Music"
                onClick={() => {}}
              />
              <ActionButton
                icon={<MapPin className="size-3" />}
                label="Map"
                onClick={() => scrollToSection("venue")}
              />
              <ActionButton
                icon={<Send className="size-3" />}
                label="RSVP"
                onClick={() => scrollToSection("rsvp")}
              />
            </div>
          </div>
        )}

        {/* Floating "Next" FAB */}
        {isOpened && currentSection !== "rsvp" && (
          <button
            onClick={goNextSection}
            className="absolute right-3 bottom-16 z-20 flex size-8 items-center justify-center rounded-full bg-foreground text-primary-foreground shadow-md transition-transform hover:scale-110 active:scale-95"
            aria-label="Next section"
          >
            <ChevronDown className="size-3.5" />
          </button>
        )}

        {/* Bottom home indicator */}
        <div className="absolute bottom-1.5 left-1/2 h-1 w-[100px] -translate-x-1/2 rounded-full bg-muted-foreground/30" />
      </div>

      {/* Section dots indicator below phone */}
      {isOpened && (
        <div className="mt-4 flex items-center gap-1.5">
          {SECTIONS.filter((s) => s !== "cover").map((s) => (
            <button
              key={s}
              onClick={() => scrollToSection(s)}
              className={cn(
                "h-1 rounded-full transition-all",
                currentSection === s
                  ? "w-4 bg-foreground"
                  : "w-1.5 bg-foreground/20 hover:bg-foreground/40"
              )}
              aria-label={`Go to ${s} section`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Action bar button                                                  */
/* ------------------------------------------------------------------ */

function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-0.5 rounded-full px-2.5 py-1 transition-colors hover:bg-secondary"
      aria-label={label}
    >
      {icon}
      <span className="text-[7px] font-medium text-muted-foreground">{label}</span>
    </button>
  )
}
