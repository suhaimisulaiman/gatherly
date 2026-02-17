"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { InvitationPreview } from "@/components/invitation-preview"
import { StudioControls } from "@/components/studio-controls"
import { StudioFooter } from "@/components/studio-footer"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function InvitationStudioPage() {
  const [language, setLanguage] = useState("english")
  const [packageType, setPackageType] = useState("gold")
  const [openingStyle, setOpeningStyle] = useState("Slide Up")
  const [animatedEffect, setAnimatedEffect] = useState("none")
  const [backgroundMusic, setBackgroundMusic] = useState(false)
  const [guestName, setGuestName] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [sheetOpen, setSheetOpen] = useState(false)

  const totalSteps = 10

  const controlsProps = {
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
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-4 py-3 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-md bg-foreground" />
            <span className="text-sm font-semibold tracking-tight text-foreground">
              Invitation Studio
            </span>
          </div>
        </div>

        <div className="hidden items-center gap-1.5 md:flex">
          <span className="text-xs text-muted-foreground">Auto-saved</span>
          <div className="size-1.5 rounded-full bg-emerald-500" />
        </div>

        {/* Mobile sheet trigger */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-border bg-card text-foreground md:hidden"
            >
              <Menu className="size-4" />
              <span>Settings</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[340px] overflow-y-auto p-0">
            <SheetHeader className="border-b border-border px-5 py-4">
              <SheetTitle className="text-sm font-semibold tracking-tight">
                Invitation Settings
              </SheetTitle>
            </SheetHeader>
            <div className="px-5 py-5">
              <StudioControls {...controlsProps} />
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col md:flex-row">
        {/* Left Panel — Desktop only */}
        <aside className="hidden md:flex md:w-[380px] lg:w-[420px] flex-col border-r border-border">
          <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
            <div className="mb-5">
              <h1 className="font-serif text-lg font-semibold tracking-tight text-foreground">
                Customize Your Invitation
              </h1>
              <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                Configure every detail of your digital card
              </p>
            </div>
            <StudioControls {...controlsProps} />
          </div>
        </aside>

        {/* Right Panel — Preview */}
        <section className="flex flex-1 flex-col" aria-label="Invitation preview">
          <div className="flex flex-1 items-center justify-center px-4 py-8 md:py-0">
            <InvitationPreview
              language={language}
              packageType={packageType}
              openingStyle={openingStyle}
              animatedEffect={animatedEffect}
              backgroundMusic={backgroundMusic}
              guestName={guestName}
            />
          </div>

          {/* Footer / Stepper */}
          <div className="border-t border-border px-4 py-3 md:px-8 md:py-4">
            <StudioFooter
              currentStep={currentStep}
              totalSteps={totalSteps}
              onBack={() =>
                setCurrentStep((prev) => Math.max(1, prev - 1))
              }
              onNext={() =>
                setCurrentStep((prev) => Math.min(totalSteps, prev + 1))
              }
            />
          </div>
        </section>
      </main>
    </div>
  )
}
