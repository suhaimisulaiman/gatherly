"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { StudioWizard } from "@/components/studio/StudioWizard"
import { ChooseDesignModal, type SelectedTemplate } from "@/components/choose-design-modal"
import { fetchConfig, fetchTemplates, type ApiTemplate, type LabelTranslations } from "@/lib/invitationApi"

export default function StudioPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = (params?.eventId as string) ?? "default"
  const [designModalOpen, setDesignModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<SelectedTemplate | null>(null)
  const [templates, setTemplates] = useState<ApiTemplate[]>([])
  const [labelTranslations, setLabelTranslations] = useState<LabelTranslations>({})

  useEffect(() => {
    Promise.all([fetchConfig(), fetchTemplates()])
      .then(([c, tpls]) => {
        setTemplates(tpls)
        setLabelTranslations(c.labelTranslations ?? {})
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (templates.length === 0) return
    if (typeof window === "undefined") return
    try {
      const raw = sessionStorage.getItem("studio:selectedTemplate")
      if (raw) {
        const parsed = JSON.parse(raw) as SelectedTemplate
        const t = templates.find((x) => x.id === parsed.id)
        if (t) {
          setSelectedTemplate({
            ...parsed,
            defaultAudioUrl: t.defaultAudioUrl ?? parsed.defaultAudioUrl,
          })
        } else {
          setSelectedTemplate(parsed)
        }
        return
      }
    } catch {
      /* ignore */
    }
    const fallback = templates.find((x) => x.id === "sakura-bloom") ?? templates[0]
    if (fallback) {
      setSelectedTemplate({
        id: fallback.id,
        name: fallback.name,
        thumbnail: fallback.thumbnail,
        colors: fallback.colors,
        design: fallback.design,
        envelopeIntro: fallback.envelopeIntro,
        defaultAudioUrl: fallback.defaultAudioUrl,
      })
    }
  }, [templates])

  function handleSelectTemplate(template: SelectedTemplate) {
    setSelectedTemplate(template)
  }

  const handleInvitationLoaded = useCallback((data: { template_id: string }) => {
    const t = templates.find((x) => x.id === data.template_id)
    if (t) {
      setSelectedTemplate({
        id: t.id,
        name: t.name,
        thumbnail: t.thumbnail,
        colors: t.colors,
        design: t.design,
        envelopeIntro: t.envelopeIntro,
        defaultAudioUrl: t.defaultAudioUrl,
      })
    }
  }, [templates])

  return (
    <StudioWizard
      eventId={eventId}
      selectedTemplate={selectedTemplate}
      onSelectTemplate={handleSelectTemplate}
      onOpenDesignModal={() => setDesignModalOpen(true)}
      designModalOpen={designModalOpen}
      setDesignModalOpen={setDesignModalOpen}
      templates={templates}
      labelTranslations={labelTranslations}
      onBackToStep1={() => router.push(eventId === "default" ? "/studio" : "/dashboard")}
      onInvitationLoaded={handleInvitationLoaded}
    />
  )
}
