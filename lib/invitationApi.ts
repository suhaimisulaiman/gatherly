/**
 * Client-side API helpers for invitations. Uses fetch with credentials (cookies).
 */

const API_BASE = "/api/v1"

export type CardLanguage = { value: string; label: string }

export type Package = { value: string; label: string; isPopular?: boolean }

export type LabelTranslations = Record<string, Record<string, string>>

export type AppConfig = {
  cardLanguages: CardLanguage[]
  packages: Package[]
  labelTranslations: LabelTranslations
}

/** Fetch app config (e.g. card languages for studio) */
export async function fetchConfig(): Promise<AppConfig> {
  const res = await fetch(`${API_BASE}/config`)
  if (!res.ok) throw new Error(`Failed to load config: ${res.status}`)
  return res.json()
}

/** API template shape (from GET /api/v1/templates) */
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

/** Fetch templates (public) */
export async function fetchTemplates(): Promise<ApiTemplate[]> {
  const res = await fetch(`${API_BASE}/templates`)
  if (!res.ok) throw new Error(`Failed to load templates: ${res.status}`)
  return res.json()
}

/** Fetch single template by id */
export async function fetchTemplate(id: string): Promise<ApiTemplate | null> {
  const res = await fetch(`${API_BASE}/templates/${encodeURIComponent(id)}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Failed to load template: ${res.status}`)
  return res.json()
}

export type Invitation = {
  id: string
  user_id: string
  template_id: string
  content: Record<string, unknown>
  status: "draft" | "published"
  slug: string | null
  created_at?: string
  updated_at?: string
}

export type InvitationContent = Record<string, unknown>

/** List invitations for the current user. Optional status filter: draft | published */
export async function fetchInvitations(status?: "draft" | "published"): Promise<Invitation[]> {
  const url = status ? `${API_BASE}/invitations?status=${status}` : `${API_BASE}/invitations`
  const res = await fetch(url, { credentials: "include" })
  if (res.status === 401) throw new Error("Unauthorized")
  if (!res.ok) throw new Error(`Failed to list invitations: ${res.status}`)
  return res.json()
}

export async function fetchInvitation(id: string): Promise<Invitation | null> {
  const res = await fetch(`${API_BASE}/invitations/${id}`, { credentials: "include" })
  if (res.status === 404 || res.status === 403) return null
  if (!res.ok) throw new Error(`Failed to load invitation: ${res.status}`)
  return res.json()
}

/** Fetch published invitation by slug (public, no auth required) */
export async function fetchInvitationBySlug(slug: string): Promise<Invitation | null> {
  const res = await fetch(`${API_BASE}/invitations/slug/${encodeURIComponent(slug)}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Failed to load invitation: ${res.status}`)
  return res.json()
}

export async function saveInvitation(params: {
  id?: string
  template_id: string
  content: InvitationContent
}): Promise<Invitation> {
  const res = await fetch(`${API_BASE}/invitations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(params),
  })
  if (res.status === 401) throw new Error("Unauthorized")
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error((data as { error?: string }).error ?? `Save failed: ${res.status}`)
  }
  return res.json()
}

export async function publishInvitation(id: string): Promise<Invitation> {
  const res = await fetch(`${API_BASE}/invitations/${id}/publish`, {
    method: "POST",
    credentials: "include",
  })
  if (res.status === 401) throw new Error("Unauthorized")
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error((data as { error?: string }).error ?? `Publish failed: ${res.status}`)
  }
  return res.json()
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isInvitationId(id: string): boolean {
  return UUID_REGEX.test(id)
}
