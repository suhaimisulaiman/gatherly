"use client"

import { Palette, Sparkles, Check } from "lucide-react"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

import type { CardLanguage, Package } from "@/lib/invitationApi"

interface StudioControlsProps {
  language: string
  setLanguage: (value: string) => void
  /** Card language options from backend. Falls back to default if empty. */
  cardLanguages?: CardLanguage[]
  packageType: string
  setPackageType: (value: string) => void
  /** Package options from backend. Falls back to default if empty. */
  packages?: Package[]
  openingStyle: string
  setOpeningStyle: (value: string) => void
  animatedEffect: string
  setAnimatedEffect: (value: string) => void
  backgroundMusic: boolean
  setBackgroundMusic: (value: boolean) => void
  backgroundMusicYoutubeUrl: string
  setBackgroundMusicYoutubeUrl: (value: string) => void
  templateName: string
  templateThumbnail?: string
  onChooseDesign: () => void
}

export function StudioControls({
  language,
  setLanguage,
  cardLanguages = [
    { value: "bahasa-melayu", label: "Bahasa Melayu" },
    { value: "english", label: "English" },
    { value: "arabic", label: "Arabic" },
  ],
  packageType,
  setPackageType,
  packages = [
    { value: "standard", label: "Standard" },
    { value: "premium", label: "Premium" },
    { value: "gold", label: "Gold", isPopular: true },
  ],
  openingStyle,
  setOpeningStyle,
  animatedEffect,
  setAnimatedEffect,
  backgroundMusic,
  setBackgroundMusic,
  backgroundMusicYoutubeUrl,
  setBackgroundMusicYoutubeUrl,
  templateName,
  templateThumbnail,
  onChooseDesign,
}: StudioControlsProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Card Language */}
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="language"
          className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground"
        >
          Card Language
        </Label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger id="language" className="w-full bg-card">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {cardLanguages.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Package */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
          Package
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {packages.map((pkg) => (
            <button
              key={pkg.value}
              onClick={() => setPackageType(pkg.value)}
              className={`relative flex cursor-pointer flex-col items-center gap-1 rounded-lg border px-3 py-3 text-xs transition-all ${
                packageType === pkg.value
                  ? "border-foreground bg-foreground text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-foreground/30"
              }`}
            >
              <span className="font-medium capitalize">{pkg.label}</span>
              {pkg.isPopular && (
                <Badge
                  variant="secondary"
                  className="absolute -top-2 -right-2 px-1.5 py-0 text-[9px]"
                >
                  Popular
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Design Selection */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
          Design
        </Label>
        {templateName ? (
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
            {templateThumbnail && (
              <div className="size-9 shrink-0 overflow-hidden rounded-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={templateThumbnail} alt="" className="size-full object-cover" />
              </div>
            )}
            <div className="flex flex-1 flex-col">
              <span className="text-sm font-medium text-foreground">{templateName}</span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-600">
                <Check className="size-2.5" /> Selected
              </span>
            </div>
            <button
              onClick={onChooseDesign}
              className="text-xs font-medium text-muted-foreground underline underline-offset-2 hover:text-foreground"
            >
              Change
            </button>
          </div>
        ) : (
          <Button
            variant="outline"
            className="h-10 w-full justify-between border-border bg-card"
            onClick={onChooseDesign}
          >
            <span className="flex items-center gap-2 text-foreground">
              <Palette className="size-4 text-muted-foreground" />
              Choose Design
            </span>
            <span className="text-xs text-muted-foreground">Browse</span>
          </Button>
        )}
      </div>

      {/* Music */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="music-url" className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
          Music
        </Label>
        <Input
          id="music-url"
          type="url"
          placeholder="YouTube video link (optional)"
          value={backgroundMusicYoutubeUrl}
          onChange={(e) => {
            const val = e.target.value
            setBackgroundMusicYoutubeUrl(val)
            setBackgroundMusic(!!val.trim())
          }}
          className="h-9 text-sm"
        />
      </div>

      {/* Opening Style */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
          Opening Style
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {["Circle Gate", "Window"].map((style) => (
            <button
              key={style}
              onClick={() => setOpeningStyle(style)}
              className={`flex cursor-pointer items-center justify-center rounded-lg border px-3 py-2.5 text-xs font-medium transition-all ${
                openingStyle === style
                  ? "border-foreground bg-foreground text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-foreground/30"
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Animated Effect */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
          Animated Effect
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {["none", "Floating Dots", "Confetti"].map((effect) => (
            <button
              key={effect}
              onClick={() => setAnimatedEffect(effect)}
              className={`flex cursor-pointer items-center justify-center gap-1 rounded-lg border px-2 py-2.5 text-xs font-medium transition-all ${
                animatedEffect === effect
                  ? "border-foreground bg-foreground text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-foreground/30"
              }`}
            >
              {effect !== "none" && <Sparkles className="size-3" />}
              {effect === "none" ? "None" : effect}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
