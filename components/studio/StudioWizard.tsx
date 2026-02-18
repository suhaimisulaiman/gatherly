"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { invitationContentSchema, defaultInvitationContent, type InvitationContent } from "@/lib/schemas/invitationContent"
import { Step2EventDetails } from "./steps/Step2EventDetails"
import { Step3EventAgenda } from "./steps/Step3EventAgenda"
import { Step4Venue } from "./steps/Step4Venue"
import { Step5Gallery } from "./steps/Step5Gallery"
import { Step6Wishes } from "./steps/Step6Wishes"
import { Step7Rsvp } from "./steps/Step7Rsvp"
import { StudioFooter } from "@/components/studio-footer"
import { InvitationPreview } from "@/components/invitation-preview"
import { ChooseDesignModal, type SelectedTemplate } from "@/components/choose-design-modal"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"
import { TEMPLATES } from "@/lib/templates"

const WEDDING_DEFAULT_MUSIC_URL = "https://www.youtube.com/watch?v=0J7R20ycaU4&t=7"

const DRAFT_KEY_PREFIX = "draft:"
const TOTAL_STEPS = 10

function loadDraft(eventId: string): Partial<InvitationContent> | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(`${DRAFT_KEY_PREFIX}${eventId}`)
    if (!raw) return null
    return JSON.parse(raw) as Partial<InvitationContent>
  } catch {
    return null
  }
}

function saveDraft(eventId: string, data: InvitationContent): boolean {
  if (typeof window === "undefined") return false
  try {
    localStorage.setItem(`${DRAFT_KEY_PREFIX}${eventId}`, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}

type Step1Options = {
  language?: string
  packageType?: string
  openingStyle?: string
  animatedEffect?: string
  backgroundMusic?: boolean
  backgroundMusicYoutubeUrl?: string
}

function loadStep1Options(): Step1Options | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem("studio:step1Options")
    if (!raw) return null
    return JSON.parse(raw) as Step1Options
  } catch {
    return null
  }
}

interface StudioWizardProps {
  eventId: string
  selectedTemplate: SelectedTemplate | null
  onSelectTemplate: (template: SelectedTemplate) => void
  onOpenDesignModal: () => void
  designModalOpen: boolean
  setDesignModalOpen: (open: boolean) => void
  onBackToStep1?: () => void
}

export function StudioWizard({
  eventId,
  selectedTemplate,
  onSelectTemplate,
  onOpenDesignModal,
  designModalOpen,
  setDesignModalOpen,
  onBackToStep1,
}: StudioWizardProps) {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(2)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [language, setLanguage] = useState("english")
  const [packageType, setPackageType] = useState("gold")
  const [openingStyle, setOpeningStyle] = useState("Circle Gate")
  const [animatedEffect, setAnimatedEffect] = useState("none")
  const [backgroundMusic, setBackgroundMusic] = useState(false)
  const [backgroundMusicYoutubeUrl, setBackgroundMusicYoutubeUrl] = useState("")

  useEffect(() => {
    const opts = loadStep1Options()
    const wedding = selectedTemplate && TEMPLATES.find((t) => t.id === selectedTemplate.id)?.themes?.includes("Wedding")
    if (opts) {
      if (opts.language != null) setLanguage(opts.language)
      if (opts.packageType != null) setPackageType(opts.packageType)
      if (opts.openingStyle != null) setOpeningStyle(opts.openingStyle)
      if (opts.animatedEffect != null) setAnimatedEffect(opts.animatedEffect)
      if (opts.backgroundMusic != null) setBackgroundMusic(opts.backgroundMusic)
      const musicUrl = opts.backgroundMusicYoutubeUrl
      if (musicUrl != null && musicUrl !== "") {
        setBackgroundMusicYoutubeUrl(musicUrl)
      } else if (wedding) {
        setBackgroundMusicYoutubeUrl(WEDDING_DEFAULT_MUSIC_URL)
      }
    } else if (wedding) {
      setBackgroundMusicYoutubeUrl(WEDDING_DEFAULT_MUSIC_URL)
    }
  }, [selectedTemplate])

  const form = useForm<InvitationContent>({
    resolver: zodResolver(invitationContentSchema),
    defaultValues: defaultInvitationContent,
  })

  useEffect(() => {
    const draft = loadDraft(eventId)
    if (draft && Object.keys(draft).length > 0) {
      form.reset({
        eventType: draft.eventType ?? defaultInvitationContent.eventType,
        invitationTitle: draft.invitationTitle ?? defaultInvitationContent.invitationTitle,
        hostNames: draft.hostNames ?? defaultInvitationContent.hostNames,
        eventDate: draft.eventDate ?? defaultInvitationContent.eventDate,
        shortGreeting: draft.shortGreeting ?? defaultInvitationContent.shortGreeting,
        includeHijriDate: draft.includeHijriDate ?? defaultInvitationContent.includeHijriDate,
        eventAgenda: draft.eventAgenda ?? defaultInvitationContent.eventAgenda,
        venueName: draft.venueName ?? defaultInvitationContent.venueName,
        address: draft.address ?? defaultInvitationContent.address,
        googleMapsLink: draft.googleMapsLink ?? defaultInvitationContent.googleMapsLink,
        wazeLink: draft.wazeLink ?? defaultInvitationContent.wazeLink,
        galleryPhotos: draft.galleryPhotos ?? defaultInvitationContent.galleryPhotos,
        enableWishes: draft.enableWishes ?? defaultInvitationContent.enableWishes,
        featuredWishes: draft.featuredWishes ?? defaultInvitationContent.featuredWishes,
        rsvpMode: draft.rsvpMode ?? defaultInvitationContent.rsvpMode,
        rsvpDeadline: draft.rsvpDeadline ?? defaultInvitationContent.rsvpDeadline,
        rsvpMessage: draft.rsvpMessage ?? defaultInvitationContent.rsvpMessage,
        maxGuests: draft.maxGuests ?? defaultInvitationContent.maxGuests,
        maxGuestsPerInvitee: draft.maxGuestsPerInvitee ?? defaultInvitationContent.maxGuestsPerInvitee,
      })
    }
  }, [eventId, form])

  const content = form.watch()

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const triggerSave = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      const data = form.getValues()
      setSaveStatus("saving")
      const ok = saveDraft(eventId, data)
      if (ok) {
        setSaveStatus("saved")
        setTimeout(() => setSaveStatus("idle"), 2000)
      } else {
        setSaveStatus("idle")
        toast({ title: "Save failed", description: "Could not save draft", variant: "destructive" })
      }
      saveTimerRef.current = null
    }, 1000)
  }, [eventId, form, toast])

  useEffect(() => {
    const sub = form.watch(triggerSave)
    return () => {
      sub.unsubscribe()
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [form, triggerSave])

  const previewGuestName = "Encik Ahmad & Family"
  const sealInitials = "SA"

  return (
    <FormProvider {...form}>
      <div className="flex min-h-svh flex-col bg-background">
        <header className="flex items-center justify-between border-b border-border px-4 py-3 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-md bg-foreground" />
            <span className="text-sm font-semibold tracking-tight text-foreground">Gatherly</span>
          </div>
          <div className="flex items-center gap-2">
            {saveStatus === "saving" && (
              <span className="text-xs text-muted-foreground">Saving…</span>
            )}
            {saveStatus === "saved" && (
              <span className="text-xs text-emerald-600">Saved</span>
            )}
            {saveStatus === "idle" && (
              <span className="text-xs text-muted-foreground">Auto-saved</span>
            )}
            <div className="size-1.5 rounded-full bg-emerald-500" />
          </div>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 border-border bg-card text-foreground md:hidden">
                <Menu className="size-4" />
                <span>Settings</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[340px] overflow-y-auto p-0">
              <SheetHeader className="border-b border-border px-5 py-4">
                <SheetTitle className="text-sm font-semibold tracking-tight">Configuring your event details</SheetTitle>
              </SheetHeader>
              <div className="px-5 py-5">
                <Button variant="outline" className="w-full" onClick={() => { onOpenDesignModal(); setSheetOpen(false); }}>
                  Choose Design
                </Button>
                {selectedTemplate && (
                  <p className="mt-2 text-xs text-muted-foreground">{selectedTemplate.name}</p>
                )}
                <div className="mt-6 md:hidden">
                  {currentStep === 2 && <Step2EventDetails />}
                  {currentStep === 3 && <Step3EventAgenda />}
                  {currentStep === 4 && <Step4Venue />}
                  {currentStep === 5 && <Step5Gallery />}
                  {currentStep === 6 && <Step6Wishes />}
                  {currentStep === 7 && <Step7Rsvp />}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex flex-1 flex-col md:flex-row">
          <aside className="hidden md:flex md:w-[380px] lg:w-[420px] flex-col border-r border-border">
            <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
              <div className="mb-5">
                <h1 className="text-lg font-semibold tracking-tight text-foreground">
                  {currentStep === 2 ? "Event Details" : currentStep === 3 ? "Event Agenda" : currentStep === 4 ? "Venue" : currentStep === 5 ? "Gallery" : currentStep === 6 ? "Wishes" : currentStep === 7 ? "RSVP" : "Configuring your event"}
                </h1>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {currentStep === 2 && "Set the main title and greeting shown on the invitation"}
                  {currentStep === 3 && "Configure the event schedule shown on the invitation"}
                  {currentStep === 4 && "Set the event location and map links"}
                  {currentStep === 5 && "Add photos to the invitation gallery"}
                  {currentStep === 6 && "Let guests post wishes and add sample wishes"}
                  {currentStep === 7 && "Configure how guests respond to the invitation"}
                  {currentStep > 7 && "Set up your invitation"}
                </p>
              </div>
              {currentStep === 2 && <Step2EventDetails />}
              {currentStep === 3 && <Step3EventAgenda />}
              {currentStep === 4 && <Step4Venue />}
              {currentStep === 5 && <Step5Gallery />}
              {currentStep === 6 && <Step6Wishes />}
              {currentStep === 7 && <Step7Rsvp />}
            </div>
          </aside>

          <section className="flex flex-1 flex-col" aria-label="Invitation preview">
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-6 md:py-0">
              <Button variant="outline" size="sm" className="md:hidden" onClick={() => setSheetOpen(true)}>
                {currentStep === 2 ? "Edit Event Details" : currentStep === 3 ? "Edit Agenda" : currentStep === 4 ? "Edit Venue" : currentStep === 5 ? "Edit Gallery" : currentStep === 6 ? "Edit Wishes" : currentStep === 7 ? "Edit RSVP" : "Edit"}
              </Button>
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
                packageType={packageType}
                backgroundMusic={backgroundMusic}
                backgroundMusicYoutubeUrl={backgroundMusicYoutubeUrl}
                guestName={true}
                previewGuestName={previewGuestName}
                envelopeGuestName={previewGuestName}
                invitationTitle={content.invitationTitle || "Sarah & Ahmed"}
                hostNames={content.hostNames}
                shortGreeting={content.shortGreeting}
                eventType={content.eventType}
                eventDate={content.eventDate}
                includeHijriDate={content.includeHijriDate}
                eventAgenda={content.eventAgenda}
                venue={content.venueName}
                address={content.address}
                googleMapsLink={content.googleMapsLink}
                wazeLink={content.wazeLink}
                galleryPhotos={content.galleryPhotos}
                enableWishes={content.enableWishes}
                featuredWishes={content.featuredWishes}
                eventId={eventId}
                rsvpMode={content.rsvpMode}
                rsvpDeadline={content.rsvpDeadline}
                rsvpMessage={content.rsvpMessage}
                maxGuests={content.maxGuests}
                maxGuestsPerInvitee={content.maxGuestsPerInvitee ?? 0}
                sealInitials={sealInitials}
                defaultOpened
                scrollToSection={currentStep === 3 ? "datetime" : currentStep === 4 ? "venue" : currentStep === 5 ? "gallery" : currentStep === 6 ? "wishes" : currentStep === 7 ? "rsvp" : undefined}
              />
            </div>
            <div className="border-t border-border px-4 py-3 md:px-8 md:py-4">
              <StudioFooter
                currentStep={currentStep}
                totalSteps={TOTAL_STEPS}
                onBack={currentStep === 2 && onBackToStep1 ? onBackToStep1 : () => setCurrentStep((s) => Math.max(1, s - 1))}
                onNext={() => setCurrentStep((s) => Math.min(TOTAL_STEPS, s + 1))}
              />
            </div>
          </section>
        </main>
      </div>

      <ChooseDesignModal
        open={designModalOpen}
        onOpenChange={setDesignModalOpen}
        onSelectTemplate={onSelectTemplate}
        selectedTemplateId={selectedTemplate?.id}
      />
    </FormProvider>
  )
}
