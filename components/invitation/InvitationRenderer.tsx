"use client"
import type { EnvelopeIntroBlockConfig } from "@/lib/templates"
import { EnvelopeIntroBlock } from "./blocks/EnvelopeIntroBlock"

/**
 * Coordinates block rendering and scroll behavior for the invitation.
 * Renders envelope intro overlay when configured; on open, scrolls to hero section.
 */
export interface InvitationRendererProps {
  /** Callback when envelope seal is opened - parent scrolls to hero */
  onEnvelopeOpen: () => void
  envelopeIntro?: EnvelopeIntroBlockConfig
  templateId?: string
  inviteeSlug?: string
  guestName?: string
  previewGuestName?: string
  /** Override wax seal initials (from Step 2 content) */
  sealInitials?: string
  children: React.ReactNode
}

export function InvitationRenderer({
  onEnvelopeOpen,
  envelopeIntro,
  templateId,
  inviteeSlug = "preview",
  guestName,
  previewGuestName,
  sealInitials: sealInitialsOverride,
  children,
}: InvitationRendererProps) {
  const useEnvelope = Boolean(envelopeIntro)

  return (
    <>
      {useEnvelope && (
        <EnvelopeIntroBlock
          guestName={guestName}
          variant={envelopeIntro?.variant ?? "classicWax"}
          sealInitials={sealInitialsOverride ?? envelopeIntro?.sealInitials}
          onOpen={onEnvelopeOpen}
          invitationId={templateId}
          inviteeSlug={inviteeSlug}
          previewGuestName={previewGuestName}
        />
      )}
      {children}
    </>
  )
}
