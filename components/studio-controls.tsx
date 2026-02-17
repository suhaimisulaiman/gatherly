"use client"

import { Palette, Sparkles, Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface StudioControlsProps {
  language: string
  setLanguage: (value: string) => void
  packageType: string
  setPackageType: (value: string) => void
  openingStyle: string
  setOpeningStyle: (value: string) => void
  animatedEffect: string
  setAnimatedEffect: (value: string) => void
  backgroundMusic: boolean
  setBackgroundMusic: (value: boolean) => void
  guestName: boolean
  setGuestName: (value: boolean) => void
  templateName: string
  templateThumbnail?: string
  onChooseDesign: () => void
}

export function StudioControls({
  language,
  setLanguage,
  packageType,
  setPackageType,
  openingStyle,
  setOpeningStyle,
  animatedEffect,
  setAnimatedEffect,
  backgroundMusic,
  setBackgroundMusic,
  guestName,
  setGuestName,
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
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="arabic">Arabic</SelectItem>
            <SelectItem value="french">French</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Package */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
          Package
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {(["standard", "premium", "gold"] as const).map((pkg) => (
            <button
              key={pkg}
              onClick={() => setPackageType(pkg)}
              className={`relative flex cursor-pointer flex-col items-center gap-1 rounded-lg border px-3 py-3 text-xs transition-all ${
                packageType === pkg
                  ? "border-foreground bg-foreground text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-foreground/30"
              }`}
            >
              <span className="font-medium capitalize">{pkg}</span>
              {pkg === "gold" && (
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

      {/* Add-ons */}
      <div className="flex flex-col gap-3">
        <Label className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
          Add-ons
        </Label>
        <Card className="border-border bg-card shadow-none">
          <CardContent className="flex flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">Background Music</span>
                <span className="text-xs text-muted-foreground">Add ambient audio to your card</span>
              </div>
              <Switch
                checked={backgroundMusic}
                onCheckedChange={setBackgroundMusic}
                aria-label="Toggle background music"
              />
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">Guest Name</span>
                <span className="text-xs text-muted-foreground">Personalize each invitation</span>
              </div>
              <Switch
                checked={guestName}
                onCheckedChange={setGuestName}
                aria-label="Toggle guest name"
              />
            </div>
          </CardContent>
        </Card>
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
