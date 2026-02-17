"use client"

import { cn } from "@/lib/utils"

interface InvitationPreviewProps {
  language: string
  packageType: string
  openingStyle: string
  animatedEffect: string
  backgroundMusic: boolean
  guestName: boolean
  className?: string
}

export function InvitationPreview({
  language,
  packageType,
  openingStyle,
  animatedEffect,
  backgroundMusic,
  guestName,
  className,
}: InvitationPreviewProps) {
  const inviteText =
    language === "arabic"
      ? "\u0623\u0646\u062A \u0645\u062F\u0639\u0648 \u0625\u0644\u0649"
      : language === "french"
        ? "Vous \u00EAtes invit\u00E9 \u00E0"
        : "You are invited to"

  const ceremonyText =
    language === "arabic"
      ? "\u062D\u0641\u0644 \u0632\u0641\u0627\u0641"
      : language === "french"
        ? "C\u00E9r\u00E9monie de mariage"
        : "Wedding Ceremony"

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="relative mx-auto w-[280px] rounded-[40px] border-[6px] border-foreground/90 bg-foreground/90 shadow-2xl">
        <div className="absolute top-0 left-1/2 z-10 h-7 w-[120px] -translate-x-1/2 rounded-b-2xl bg-foreground/90" />

        <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[34px] bg-card">
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div className="mb-6 h-px w-16 bg-accent" />

            <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              {inviteText}
            </p>

            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Sarah & Ahmed
            </h2>

            <div className="my-4 h-px w-8 bg-accent" />

            <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {ceremonyText}
            </p>

            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Saturday, March 15, 2026
              <br />
              The Grand Pavilion
            </p>

            {guestName && (
              <div className="mt-5 rounded-full border border-border px-4 py-1.5">
                <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                  Dear Guest Name
                </p>
              </div>
            )}

            <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-1.5">
                {backgroundMusic && (
                  <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[8px] tracking-wide text-muted-foreground">
                    Music
                  </span>
                )}
                {animatedEffect !== "none" && (
                  <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[8px] tracking-wide text-muted-foreground">
                    {animatedEffect}
                  </span>
                )}
              </div>
              <span className="text-[8px] tracking-wide text-muted-foreground/60">
                {packageType === "premium"
                  ? "Premium"
                  : packageType === "gold"
                    ? "Gold"
                    : "Standard"}{" "}
                &middot; {openingStyle}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-2 left-1/2 h-1 w-[100px] -translate-x-1/2 rounded-full bg-muted-foreground/30" />
      </div>
    </div>
  )
}
