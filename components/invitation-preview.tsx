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
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      {/* Phone frame */}
      <div className="relative mx-auto w-[280px] h-[560px] rounded-[40px] border-[6px] border-foreground/90 bg-foreground/90 shadow-2xl">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[28px] bg-foreground/90 rounded-b-2xl z-10" />

        {/* Screen */}
        <div className="relative w-full h-full rounded-[34px] overflow-hidden bg-card">
          {/* Invitation content mock */}
          <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            {/* Decorative top element */}
            <div className="w-16 h-px bg-accent mb-6" />

            <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3">
              {language === "english" ? "You are invited to" : language === "arabic" ? "\u0623\u0646\u062A \u0645\u062F\u0639\u0648 \u0625\u0644\u0649" : "Vous \u00EAtes invit\u00E9 \u00E0"}
            </p>

            <h2 className="font-serif text-xl tracking-tight text-foreground mb-1">
              Sarah & Ahmed
            </h2>

            <div className="w-8 h-px bg-accent my-4" />

            <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">
              {language === "english" ? "Wedding Ceremony" : language === "arabic" ? "\u062D\u0641\u0644 \u0632\u0641\u0627\u0641" : "C\u00E9r\u00E9monie de mariage"}
            </p>

            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
              Saturday, March 15, 2026
              <br />
              The Grand Pavilion
            </p>

            {guestName && (
              <div className="mt-5 px-4 py-1.5 rounded-full border border-border">
                <p className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground">
                  Dear Guest Name
                </p>
              </div>
            )}

            {/* Bottom badges */}
            <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-1.5">
                {backgroundMusic && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary text-[8px] text-muted-foreground tracking-wide">
                    Music
                  </span>
                )}
                {animatedEffect !== "none" && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary text-[8px] text-muted-foreground tracking-wide">
                    {animatedEffect}
                  </span>
                )}
              </div>
              <span className="text-[8px] text-muted-foreground/60 tracking-wide">
                {packageType === "premium" ? "Premium" : packageType === "gold" ? "Gold" : "Standard"} &middot; {openingStyle}
              </span>
            </div>
          </div>
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[100px] h-[4px] bg-muted-foreground/30 rounded-full" />
      </div>
    </div>
  )
}
