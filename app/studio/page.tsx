"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu } from "lucide-react"
import { InvitationPreview } from "@/components/invitation-preview"
import { StudioControls } from "@/components/studio-controls"
import { StudioFooter } from "@/components/studio-footer"
import { ChooseDesignModal, type SelectedTemplate } from "@/components/choose-design-modal"
import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/auth/UserMenu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { fetchConfig, fetchTemplates, type CardLanguage, type Package, type ApiTemplate, type LabelTranslations } from "@/lib/invitationApi"

export default function StudioPage() {
  const router = useRouter()
  const [language, setLanguage] = useState("english")
  const [packageType, setPackageType] = useState("gold")
  const [openingStyle, setOpeningStyle] = useState("Circle Gate")
  const [animatedEffect, setAnimatedEffect] = useState("none")
  const [backgroundMusic, setBackgroundMusic] = useState(false)
  const [backgroundMusicYoutubeUrl, setBackgroundMusicYoutubeUrl] = useState("")
  const [currentStep, setCurrentStep] = useState(1)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [designModalOpen, setDesignModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<SelectedTemplate | null>(null)
  const [cardLanguages, setCardLanguages] = useState<CardLanguage[]>([])
  const [packages, setPackages] = useState<Package[]>([])
  const [templates, setTemplates] = useState<ApiTemplate[]>([])
  const [labelTranslations, setLabelTranslations] = useState<LabelTranslations>({})

  const labels = labelTranslations[language] ?? labelTranslations["english"] ?? {}
  const totalSteps = 10

  useEffect(() => {
    Promise.all([fetchConfig(), fetchTemplates()])
      .then(([c, tpls]) => {
        setCardLanguages(c.cardLanguages)
        const pkgs = c.packages ?? []
        setPackages(pkgs)
        if (pkgs.length > 0) {
          setPackageType((prev) =>
            pkgs.some((p) => p.value === prev) ? prev : pkgs[0].value
          )
        }
        setTemplates(tpls)
        setLabelTranslations(c.labelTranslations ?? {})
      })
      .catch(() => { /* fallback to StudioControls defaults */ })
  }, [])

  function handleSelectTemplate(template: SelectedTemplate) {
    setSelectedTemplate(template)
    if (template.defaultAudioUrl && !backgroundMusicYoutubeUrl) {
      setBackgroundMusicYoutubeUrl(template.defaultAudioUrl)
    }
  }

  const controlsProps = {
    language,
    setLanguage,
    cardLanguages: cardLanguages.length > 0 ? cardLanguages : undefined,
    packageType,
    setPackageType,
    packages: packages.length > 0 ? packages : undefined,
    openingStyle,
    setOpeningStyle,
    animatedEffect,
    setAnimatedEffect,
    backgroundMusic,
    setBackgroundMusic,
    backgroundMusicYoutubeUrl,
    setBackgroundMusicYoutubeUrl,
    templateName: selectedTemplate?.name || "",
    templateThumbnail: selectedTemplate?.thumbnail,
    onChooseDesign: () => setDesignModalOpen(true),
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-4 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="size-7 rounded-md bg-foreground" />
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Gatherly
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-muted-foreground md:inline">Auto-saved</span>
          <div className="size-1.5 rounded-full bg-emerald-500" />
          <UserMenu />
        </div>
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

      {/* Main */}
      <main className="flex flex-1 flex-col md:flex-row">
        {/* Left panel (desktop) */}
        <aside className="hidden md:flex md:w-[380px] lg:w-[420px] flex-col border-r border-border">
          <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
            <div className="mb-5">
              <h1 className="text-lg font-semibold tracking-tight text-foreground">
                Step 1 — Choose Design
              </h1>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                Select a template and configure add-ons before adding your event details
              </p>
            </div>
            <StudioControls {...controlsProps} />
          </div>
        </aside>

        {/* Right panel (preview) */}
        <section className="flex flex-1 flex-col" aria-label="Invitation preview">
          <div className="flex flex-1 items-center justify-center px-4 py-6 md:py-0">
            <InvitationPreview
              templateId={selectedTemplate?.id}
              templateName={selectedTemplate?.name}
              templateThumbnail={selectedTemplate?.thumbnail}
              colors={selectedTemplate?.colors}
              design={selectedTemplate?.design}
              envelopeIntro={selectedTemplate?.envelopeIntro}
              openingStyle={openingStyle}
              animatedEffect={animatedEffect}
              language={language}
              labels={labels}
              packageType={packageType}
              backgroundMusic={backgroundMusic}
              backgroundMusicYoutubeUrl={backgroundMusicYoutubeUrl}
              guestName={true}
              previewGuestName="Encik Ahmad & Family"
            />
          </div>
          <div className="border-t border-border px-4 py-3 md:px-8 md:py-4">
            <StudioFooter
              currentStep={currentStep}
              totalSteps={totalSteps}
              onBack={() => setCurrentStep((s) => Math.max(1, s - 1))}
              nextDisabled={currentStep === 1 && !selectedTemplate}
              onNext={() => {
                if (currentStep === 1) {
                  if (selectedTemplate) {
                    try {
                      sessionStorage.setItem("studio:selectedTemplate", JSON.stringify(selectedTemplate))
                      sessionStorage.setItem("studio:step1Options", JSON.stringify({
                        language,
                        packageType,
                        openingStyle,
                        animatedEffect,
                        backgroundMusic,
                        backgroundMusicYoutubeUrl,
                      }))
                    } catch {
                      /* ignore */
                    }
                  }
                  router.push("/events/default/studio")
                } else {
                  setCurrentStep((s) => Math.min(totalSteps, s + 1))
                }
              }}
            />
          </div>
        </section>
      </main>

      {/* Design modal */}
      <ChooseDesignModal
        templates={templates}
        open={designModalOpen}
        onOpenChange={setDesignModalOpen}
        onSelectTemplate={handleSelectTemplate}
        selectedTemplateId={selectedTemplate?.id}
      />
    </div>
  )
}
