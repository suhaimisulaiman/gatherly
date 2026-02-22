"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { invitationContentSchema, defaultInvitationContent, type InvitationContent } from "@/lib/schemas/invitationContent"
import { fetchInvitation, saveInvitation, publishInvitation, isInvitationId, type ApiTemplate, type LabelTranslations } from "@/lib/invitationApi"
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
import { UserMenu } from "@/components/auth/UserMenu"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"

const TOTAL_STEPS = 10

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
  templates: ApiTemplate[]
  labelTranslations?: LabelTranslations
  onBackToStep1?: () => void
  /** Called when an existing invitation is loaded (for template sync) */
  onInvitationLoaded?: (data: { template_id: string; content: InvitationContent }) => void
}

export function StudioWizard({
  eventId,
  selectedTemplate,
  onSelectTemplate,
  onOpenDesignModal,
  designModalOpen,
  setDesignModalOpen,
  templates,
  labelTranslations = {},
  onBackToStep1,
  onInvitationLoaded,
}: StudioWizardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(2)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
  const [publishLoading, setPublishLoading] = useState(false)
  const [invitationId, setInvitationId] = useState<string | null>(isInvitationId(eventId) ? eventId : null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [language, setLanguage] = useState("english")
  const [packageType, setPackageType] = useState("gold")
  const [openingStyle, setOpeningStyle] = useState("Circle Gate")
  const [animatedEffect, setAnimatedEffect] = useState("none")
  const [backgroundMusic, setBackgroundMusic] = useState(false)
  const [backgroundMusicYoutubeUrl, setBackgroundMusicYoutubeUrl] = useState("")

  useEffect(() => {
    const opts = loadStep1Options()
    const defaultAudio = selectedTemplate?.defaultAudioUrl
    if (opts) {
      if (opts.language != null) setLanguage(opts.language)
      if (opts.packageType != null) setPackageType(opts.packageType)
      if (opts.openingStyle != null) setOpeningStyle(opts.openingStyle)
      if (opts.animatedEffect != null) setAnimatedEffect(opts.animatedEffect)
      if (opts.backgroundMusic != null) setBackgroundMusic(opts.backgroundMusic)
      if (opts.backgroundMusicYoutubeUrl != null) setBackgroundMusicYoutubeUrl(opts.backgroundMusicYoutubeUrl)
      const musicUrl = opts.backgroundMusicYoutubeUrl
      if (musicUrl != null && musicUrl !== "") {
        setBackgroundMusicYoutubeUrl(musicUrl)
      } else if (defaultAudio) {
        setBackgroundMusicYoutubeUrl(defaultAudio)
      }
    } else if (defaultAudio) {
      setBackgroundMusicYoutubeUrl(defaultAudio)
    }
  }, [selectedTemplate])

  const form = useForm<InvitationContent>({
    resolver: zodResolver(invitationContentSchema),
    defaultValues: defaultInvitationContent,
  })

  useEffect(() => {
    if (!isInvitationId(eventId)) return
    let cancelled = false
    fetchInvitation(eventId)
      .then((inv) => {
        if (cancelled || !inv?.content) return
        const c = inv.content as Record<string, unknown>
        const content: InvitationContent = {
          eventType: (c.eventType as string) ?? defaultInvitationContent.eventType,
          invitationTitle: (c.invitationTitle as string) ?? defaultInvitationContent.invitationTitle,
          hostNames: (c.hostNames as string) ?? defaultInvitationContent.hostNames,
          eventDate: (c.eventDate as string) ?? defaultInvitationContent.eventDate,
          shortGreeting: (c.shortGreeting as string) ?? defaultInvitationContent.shortGreeting,
          includeHijriDate: (c.includeHijriDate as boolean) ?? defaultInvitationContent.includeHijriDate,
          eventAgenda: (c.eventAgenda as InvitationContent["eventAgenda"]) ?? defaultInvitationContent.eventAgenda,
          venueName: (c.venueName as string) ?? defaultInvitationContent.venueName,
          address: (c.address as string) ?? defaultInvitationContent.address,
          googleMapsLink: (c.googleMapsLink as string) ?? defaultInvitationContent.googleMapsLink,
          wazeLink: (c.wazeLink as string) ?? defaultInvitationContent.wazeLink,
          galleryPhotos: (c.galleryPhotos as string[]) ?? defaultInvitationContent.galleryPhotos,
          enableWishes: (c.enableWishes as boolean) ?? defaultInvitationContent.enableWishes,
          featuredWishes: (c.featuredWishes as InvitationContent["featuredWishes"]) ?? defaultInvitationContent.featuredWishes,
          rsvpMode: (c.rsvpMode as "guest-list" | "open") ?? defaultInvitationContent.rsvpMode,
          rsvpDeadline: (c.rsvpDeadline as string) ?? defaultInvitationContent.rsvpDeadline,
          rsvpMessage: (c.rsvpMessage as string) ?? defaultInvitationContent.rsvpMessage,
          maxGuests: c.maxGuests as number | undefined,
          maxGuestsPerInvitee: (c.maxGuestsPerInvitee as number) ?? defaultInvitationContent.maxGuestsPerInvitee,
          language: (c.language as string) ?? "english",
          packageType: (c.packageType as string) ?? "gold",
          openingStyle: (c.openingStyle as string) ?? "Circle Gate",
          animatedEffect: (c.animatedEffect as string) ?? "none",
          backgroundMusic: (c.backgroundMusic as boolean) ?? false,
          backgroundMusicYoutubeUrl: (c.backgroundMusicYoutubeUrl as string) ?? "",
        }
        form.reset(content)
        setLanguage((c.language as string) ?? "english")
        setPackageType((c.packageType as string) ?? "gold")
        setOpeningStyle((c.openingStyle as string) ?? "Circle Gate")
        setAnimatedEffect((c.animatedEffect as string) ?? "none")
        setBackgroundMusic((c.backgroundMusic as boolean) ?? false)
        setBackgroundMusicYoutubeUrl((c.backgroundMusicYoutubeUrl as string) ?? "")
        setInvitationId(inv.id)
        onInvitationLoaded?.({ template_id: inv.template_id, content })
      })
      .catch(() => {
        if (!cancelled) toast({ title: "Could not load invitation", variant: "destructive" })
      })
    return () => { cancelled = true }
  }, [eventId, form, onInvitationLoaded, toast])

  const content = form.watch()

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const triggerSave = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      const data = form.getValues() as Record<string, unknown>
      const templateId = selectedTemplate?.id ?? "elegant-rose"
      const content = {
        ...data,
        language,
        packageType,
        openingStyle,
        animatedEffect,
        backgroundMusic,
        backgroundMusicYoutubeUrl,
      }
      setSaveStatus("saving")
      saveInvitation({
        id: invitationId ?? undefined,
        template_id: templateId,
        content,
      })
        .then((inv) => {
          setInvitationId(inv.id)
          if (!invitationId) router.replace(`/events/${inv.id}/studio`)
          setSaveStatus("saved")
          setTimeout(() => setSaveStatus("idle"), 2000)
        })
        .catch((err) => {
          setSaveStatus("idle")
          if (err.message === "Unauthorized") {
            router.push("/login?next=" + encodeURIComponent(window.location.pathname))
          } else {
            toast({ title: "Save failed", description: err.message ?? "Could not save draft", variant: "destructive" })
          }
        })
        .finally(() => {
          saveTimerRef.current = null
        })
    }, 1000)
  }, [invitationId, selectedTemplate?.id, form, router, toast, language, packageType, openingStyle, animatedEffect, backgroundMusic, backgroundMusicYoutubeUrl])

  useEffect(() => {
    const sub = form.watch(triggerSave)
    return () => {
      sub.unsubscribe()
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [form, triggerSave])

  const handlePublish = useCallback(() => {
    const doPublish = (id: string) => {
      setPublishLoading(true)
      publishInvitation(id)
        .then((inv) => {
          if (inv.slug) router.push(`/events/${id}/published?slug=${encodeURIComponent(inv.slug)}`)
          else toast({ title: "Published", description: "Your invitation is live." })
        })
        .catch((err) => {
          setPublishLoading(false)
          if (err.message === "Unauthorized") {
            router.push("/login?next=" + encodeURIComponent(window.location.pathname))
          } else {
            toast({ title: "Publish failed", description: err.message ?? "Could not publish", variant: "destructive" })
          }
        })
    }
    if (invitationId) {
      doPublish(invitationId)
    } else {
      const data = form.getValues() as Record<string, unknown>
      const templateId = selectedTemplate?.id ?? "elegant-rose"
      const content = {
        ...data,
        language,
        packageType,
        openingStyle,
        animatedEffect,
        backgroundMusic,
        backgroundMusicYoutubeUrl,
      }
      setPublishLoading(true)
      saveInvitation({
        template_id: templateId,
        content,
      })
        .then((inv) => {
          setInvitationId(inv.id)
          router.replace(`/events/${inv.id}/studio`)
          doPublish(inv.id)
        })
        .catch((err) => {
          setPublishLoading(false)
          if (err.message === "Unauthorized") {
            router.push("/login?next=" + encodeURIComponent(window.location.pathname))
          } else {
            toast({ title: "Publish failed", description: err.message ?? "Could not save before publish", variant: "destructive" })
          }
        })
    }
  }, [invitationId, form, selectedTemplate?.id, router, toast, language, packageType, openingStyle, animatedEffect, backgroundMusic, backgroundMusicYoutubeUrl])

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
            <UserMenu />
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
                labels={labelTranslations[language] ?? labelTranslations["english"] ?? {}}
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
                onPublish={handlePublish}
                publishLoading={publishLoading}
              />
            </div>
          </section>
        </main>
      </div>

      <ChooseDesignModal
        templates={templates}
        open={designModalOpen}
        onOpenChange={setDesignModalOpen}
        onSelectTemplate={onSelectTemplate}
        selectedTemplateId={selectedTemplate?.id}
      />
    </FormProvider>
  )
}
