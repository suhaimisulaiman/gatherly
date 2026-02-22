/**
 * Server-side template access. Reads from DB.
 */

import { createClient } from "@/lib/supabase/server"

export type ApiTemplate = {
  id: string
  name: string
  thumbnail: string
  themes: string[]
  styles: string[]
  tier: "free" | "premium"
  tags: string[]
  colors: { bg: string; text: string; accent: string; muted: string }
  design: Record<string, unknown>
  envelopeIntro?: { type: string; variant?: string; sealInitials?: string }
  defaultAudioUrl: string | null
}

function mapRow(row: {
  id: string
  name: string
  thumbnail_url: string
  themes: string[]
  styles: string[]
  tier: string
  tags: string[]
  colors: unknown
  design: unknown
  envelope_intro: unknown
  default_audio_url: string | null
}): ApiTemplate {
  return {
    id: row.id,
    name: row.name,
    thumbnail: row.thumbnail_url,
    themes: row.themes ?? [],
    styles: row.styles ?? [],
    tier: row.tier === "premium" ? "premium" : "free",
    tags: row.tags ?? [],
    colors: (row.colors as ApiTemplate["colors"]) ?? { bg: "#fff", text: "#000", accent: "#666", muted: "#999" },
    design: (row.design as ApiTemplate["design"]) ?? {},
    envelopeIntro: row.envelope_intro ? (row.envelope_intro as ApiTemplate["envelopeIntro"]) : undefined,
    defaultAudioUrl: row.default_audio_url ?? null,
  }
}

export async function getTemplates(): Promise<ApiTemplate[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("templates")
    .select("id, name, thumbnail_url, themes, styles, tier, tags, colors, design, envelope_intro, default_audio_url")
    .eq("active", true)
    .order("sort_order", { ascending: true })
  if (error) throw new Error(error.message)
  return (data ?? []).map(mapRow)
}

export async function getTemplateById(id: string): Promise<ApiTemplate | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("templates")
    .select("id, name, thumbnail_url, themes, styles, tier, tags, colors, design, envelope_intro, default_audio_url")
    .eq("id", id)
    .eq("active", true)
    .single()
  if (error || !data) return null
  return mapRow(data)
}
