"use client"

import { Palette, Sparkles } from "lucide-react"
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
  onChooseDesign,
}: StudioControlsProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Card Language */}
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="language"
          className="text-xs tracking-[0.1em] uppercase text-muted-foreground font-medium"
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
        <Label className="text-xs tracking-[0.1em] uppercase text-muted-foreground font-medium">
          Package
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {(["standard", "premium", "gold"] as const).map((pkg) => (
            <button
              key={pkg}
              onClick={() => setPackageType(pkg)}
              className={`relative flex flex-col items-center gap-1 rounded-lg border px-3 py-3 text-xs transition-all cursor-pointer ${
                packageType === pkg
                  ? "border-foreground bg-foreground text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-foreground/30"
              }`}
            >
              <span className="font-medium capitalize">{pkg}</span>
              {pkg === "gold" && (
                <Badge
                  variant="secondary"
                  className="absolute -top-2 -right-2 text-[9px] px-1.5 py-0"
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
        <Label className="text-xs tracking-[0.1em] uppercase text-muted-foreground font-medium">
          Add-ons
        </Label>
        <Card className="border-border bg-card shadow-none">
          <CardContent className="flex flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">
                  Background Music
                </span>
                <span className="text-xs text-muted-foreground">
                  Add ambient audio to your card
                </span>
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
                <span className="text-sm font-medium text-foreground">
                  Guest Name
                </span>
                <span className="text-xs text-muted-foreground">
                  Personalize each invitation
                </span>
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
        <Label className="text-xs tracking-[0.1em] uppercase text-muted-foreground font-medium">
          Design
        </Label>
        <Button
          variant="outline"
          className="w-full justify-between bg-card border-border h-10"
          onClick={onChooseDesign}
        >
          <span className="flex items-center gap-2 text-foreground">
            <Palette className="size-4 text-muted-foreground" />
            {templateName || "Choose Design"}
          </span>
          <span className="text-xs text-muted-foreground">Browse</span>
        </Button>
      </div>

      {/* Opening Style */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs tracking-[0.1em] uppercase text-muted-foreground font-medium">
          Opening Style
        </Label>
        <Select value={openingStyle} onValueChange={setOpeningStyle}>
          <SelectTrigger className="w-full bg-card">
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Slide Up">Slide Up</SelectItem>
            <SelectItem value="Fade In">Fade In</SelectItem>
            <SelectItem value="Flip">Flip</SelectItem>
            <SelectItem value="Zoom">Zoom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Animated Effect */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs tracking-[0.1em] uppercase text-muted-foreground font-medium">
          Animated Effect
        </Label>
        <Select value={animatedEffect} onValueChange={setAnimatedEffect}>
          <SelectTrigger className="w-full bg-card">
            <SelectValue placeholder="Select effect" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="Confetti">
              <span className="flex items-center gap-2">
                <Sparkles className="size-3.5" />
                Confetti
              </span>
            </SelectItem>
            <SelectItem value="Petals">Petals</SelectItem>
            <SelectItem value="Stars">Stars</SelectItem>
            <SelectItem value="Hearts">Hearts</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
