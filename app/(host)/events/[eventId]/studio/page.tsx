"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { StudioWizard } from "@/components/studio/StudioWizard"
import { ChooseDesignModal, type SelectedTemplate } from "@/components/choose-design-modal"
import { TEMPLATES } from "@/lib/templates"

function getInitialTemplate(): SelectedTemplate | null {
  if (typeof window === "undefined") {
    const t = TEMPLATES.find((x) => x.id === "sakura-bloom")
    return t ? { id: t.id, name: t.name, thumbnail: t.thumbnail, colors: t.colors, design: t.design, envelopeIntro: t.envelopeIntro } : null
  }
  try {
    const raw = sessionStorage.getItem("studio:selectedTemplate")
    if (raw) {
      return JSON.parse(raw) as SelectedTemplate
    }
  } catch {
    /* ignore */
  }
  const t = TEMPLATES.find((x) => x.id === "sakura-bloom")
  return t ? { id: t.id, name: t.name, thumbnail: t.thumbnail, colors: t.colors, design: t.design, envelopeIntro: t.envelopeIntro } : null
}

export default function StudioPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = (params?.eventId as string) ?? "default"
  const [designModalOpen, setDesignModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<SelectedTemplate | null>(null)

  useEffect(() => {
    setSelectedTemplate(getInitialTemplate())
  }, [])

  function handleSelectTemplate(template: SelectedTemplate) {
    setSelectedTemplate(template)
  }

  return (
    <StudioWizard
      eventId={eventId}
      selectedTemplate={selectedTemplate}
      onSelectTemplate={handleSelectTemplate}
      onOpenDesignModal={() => setDesignModalOpen(true)}
      designModalOpen={designModalOpen}
      setDesignModalOpen={setDesignModalOpen}
      onBackToStep1={() => router.push("/")}
    />
  )
}
