"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { InvitationPreview } from "@/components/invitation-preview"
import { fetchInvitationBySlug, fetchTemplate, fetchConfig, type ApiTemplate, type LabelTranslations } from "@/lib/invitationApi"
import type { InvitationContent } from "@/lib/schemas/invitationContent"

const DEFAULT_OPTS = {
  openingStyle: "Circle Gate",
  animatedEffect: "none",
  language: "english",
  packageType: "gold",
  backgroundMusic: false,
  backgroundMusicYoutubeUrl: "",
}

export default function PublicInvitationPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [invitation, setInvitation] = useState<Awaited<ReturnType<typeof fetchInvitationBySlug>>>(null)
  const [template, setTemplate] = useState<ApiTemplate | null | undefined>(undefined)
  const [labelTranslations, setLabelTranslations] = useState<LabelTranslations>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchConfig().then((c) => setLabelTranslations(c.labelTranslations ?? {})).catch(() => {})
  }, [])

  useEffect(() => {
    if (!slug) return
    setError(null)
    setTemplate(undefined)
    fetchInvitationBySlug(slug)
      .then((inv) => {
        if (inv) {
          setInvitation(inv)
          return fetchTemplate(inv.template_id)
        }
        setError("Invitation not found")
        return null
      })
      .then((tpl) => {
        if (tpl !== undefined) setTemplate(tpl ?? null)
      })
      .catch(() => setError("Invitation not found"))
  }, [slug])

  if (error) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-4">
        <h1 className="text-xl font-semibold text-foreground">Invitation not found</h1>
        <p className="text-sm text-muted-foreground">
          This invitation may have been removed or the link is incorrect.
        </p>
      </div>
    )
  }

  if (!invitation && !error) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-4">
        <div className="size-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading invitation…</p>
      </div>
    )
  }

  if (invitation && template === undefined) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-4">
        <div className="size-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    )
  }

  if (invitation && !template) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-4">
        <h1 className="text-xl font-semibold text-foreground">Template not found</h1>
        <p className="text-sm text-muted-foreground">The design for this invitation is no longer available.</p>
      </div>
    )
  }
  const content = (invitation.content || {}) as Partial<InvitationContent> & { language?: string; packageType?: string; openingStyle?: string; animatedEffect?: string; backgroundMusic?: boolean; backgroundMusicYoutubeUrl?: string }
  const language = content.language ?? DEFAULT_OPTS.language
  const labels = labelTranslations[language] ?? labelTranslations["english"] ?? {}

  return (
    <div className="min-h-svh bg-background">
      <InvitationPreview
        templateId={template?.id}
        templateName={template?.name}
        templateThumbnail={template?.thumbnail}
        colors={template?.colors}
        design={template?.design}
        envelopeIntro={template?.envelopeIntro}
        openingStyle={content.openingStyle ?? DEFAULT_OPTS.openingStyle}
        animatedEffect={content.animatedEffect ?? DEFAULT_OPTS.animatedEffect}
        language={language}
        labels={labels}
        packageType={content.packageType ?? DEFAULT_OPTS.packageType}
        backgroundMusic={content.backgroundMusic ?? DEFAULT_OPTS.backgroundMusic}
        backgroundMusicYoutubeUrl={content.backgroundMusicYoutubeUrl ?? DEFAULT_OPTS.backgroundMusicYoutubeUrl}
        guestName
        envelopeGuestName="Guest"
        previewGuestName="Guest"
        invitationTitle={content.invitationTitle}
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
        eventId={slug}
        rsvpMode={content.rsvpMode}
        rsvpDeadline={content.rsvpDeadline}
        rsvpMessage={content.rsvpMessage}
        maxGuests={content.maxGuests}
        maxGuestsPerInvitee={content.maxGuestsPerInvitee ?? 0}
        sealInitials={content.hostNames?.split(/[\s&]+/).map((s) => s[0]).join("").slice(0, 2).toUpperCase()}
        defaultOpened={false}
      />
    </div>
  )
}
