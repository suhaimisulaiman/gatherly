"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"

export type EnvelopeIntroVariant = "classicWax" | "minimalWax" | "floralWax"

export interface EnvelopeIntroBlockProps {
  guestName?: string
  variant?: EnvelopeIntroVariant
  /** Monogram/initials on the wax seal (e.g. "SA" for Sarah & Ahmed) */
  sealInitials?: string
  onOpen: () => void
  /** For sessionStorage persistence: invitationId + inviteeSlug */
  invitationId?: string
  inviteeSlug?: string
  /** Preview mode: pass mock guest name */
  previewGuestName?: string
}

const STORAGE_KEY_PREFIX = "invitation_envelope_opened"

function getStorageKey(invitationId?: string, inviteeSlug?: string): string | null {
  if (!invitationId) return null
  const slug = inviteeSlug ?? "guest"
  return `${STORAGE_KEY_PREFIX}_${invitationId}_${slug}`
}

export function EnvelopeIntroBlock({
  guestName,
  variant = "classicWax",
  sealInitials = "SA",
  onOpen,
  invitationId,
  inviteeSlug,
  previewGuestName,
}: EnvelopeIntroBlockProps) {
  const displayName = previewGuestName ?? guestName ?? "Dear Guest"
  const initials = (sealInitials ?? "SA").slice(0, 2).toUpperCase()
  const storageKey = getStorageKey(invitationId, inviteeSlug)
  const isPreview = inviteeSlug === "preview"

  const [opened, setOpened] = useState(false)
  const [animating, setAnimating] = useState(false)

  const wasOpened = !isPreview && typeof window !== "undefined" && storageKey && sessionStorage.getItem(storageKey) === "1"

  useEffect(() => {
    if (wasOpened) {
      setOpened(true)
    }
  }, [wasOpened])

  const handleOpen = useCallback(() => {
    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (storageKey && !isPreview) {
      sessionStorage.setItem(storageKey, "1")
    }
    setAnimating(true)

    const duration = prefersReducedMotion ? 50 : 800
    setTimeout(() => {
      setOpened(true)
      setAnimating(false)
      onOpen()
    }, duration)
  }, [onOpen, storageKey])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        if (!opened && !animating) handleOpen()
      }
    },
    [handleOpen, opened, animating]
  )

  if (opened) return null

  return (
    <div
      className={cn(
        "absolute inset-0 z-40 flex min-h-full w-full flex-col items-center justify-center px-6 transition-opacity duration-500 ease-out",
        animating && "opacity-0"
      )}
      style={{
        background: "linear-gradient(180deg, #f5f0e8 0%, #ebe4d8 25%, #e5ddd0 50%, #ebe4d8 75%, #f5f0e8 100%)",
        boxShadow: "inset 0 0 60px rgba(139, 115, 85, 0.06)",
      }}
    >
      {/* Paper texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Envelope content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <p
          className="mb-1 text-[10px] font-medium uppercase tracking-[0.35em]"
          style={{ color: "#8b7355", opacity: 0.9 }}
        >
          To:
        </p>
        <h2
          className={cn(
            "max-w-[85%] font-serif text-xl tracking-[0.08em]",
            variant === "classicWax" && "font-medium",
            variant === "minimalWax" && "font-light",
            variant === "floralWax" && "font-medium italic"
          )}
          style={{ color: "#3e3428", lineHeight: 1.3 }}
        >
          {displayName}
        </h2>
        <p
          className="mt-6 text-[9px] uppercase tracking-[0.2em]"
          style={{ color: "#8b7355", opacity: 0.7 }}
        >
          Tap the seal to open
        </p>
      </div>

      {/* Wax seal button - classic red/burgundy wax with initials */}
      <div className="relative z-10 mt-8">
        <button
          type="button"
          onClick={handleOpen}
          onKeyDown={handleKeyDown}
          disabled={animating}
          aria-label="Open invitation"
          className={cn(
            "group flex size-20 cursor-pointer items-center justify-center rounded-full border-0 outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-900/40",
            animating ? "pointer-events-none scale-95 opacity-0" : "hover:scale-105 active:scale-95"
          )}
          style={{
            background: "radial-gradient(circle at 35% 35%, #d4726a, #a8322d 45%, #6b1a18 60%, #4a0f0d)",
            boxShadow: `
              inset 3px 3px 6px rgba(255,255,255,0.25),
              inset -3px -3px 6px rgba(0,0,0,0.35),
              0 4px 12px rgba(107,26,24,0.5),
              0 2px 6px rgba(0,0,0,0.25)
            `,
          }}
        >
          {/* Monogram initials - embossed into wax */}
          {variant === "classicWax" && (
            <span
              className="select-none font-serif text-2xl font-semibold tracking-wider"
              style={{
                color: "rgba(0,0,0,0.35)",
                textShadow: "1px 1px 0 rgba(255,255,255,0.2), -1px -1px 0 rgba(0,0,0,0.2)",
              }}
            >
              {initials}
            </span>
          )}
          {variant === "minimalWax" && (
            <span
              className="select-none font-serif text-xl font-medium tracking-widest"
              style={{
                color: "rgba(0,0,0,0.3)",
                textShadow: "0 1px 0 rgba(255,255,255,0.3)",
              }}
            >
              {initials}
            </span>
          )}
          {variant === "floralWax" && (
            <span
              className="select-none font-serif italic tracking-[0.2em]"
              style={{
                color: "rgba(0,0,0,0.35)",
                textShadow: "1px 1px 0 rgba(255,255,255,0.2)",
                fontSize: "1.1rem",
              }}
            >
              {initials}
            </span>
          )}
        </button>
      </div>

      {/* Reduced motion: skip animation */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .duration-500 { transition-duration: 0.01ms !important; }
        }
      `}</style>
    </div>
  )
}
