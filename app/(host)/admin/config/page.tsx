"use client"

import { useState, useEffect } from "react"
import { fetchConfig } from "@/lib/invitationApi"
import type { CardLanguage, Package, LabelTranslations } from "@/lib/invitationApi"
import { LABEL_KEYS } from "@/lib/labelKeys"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2 } from "lucide-react"

const API_BASE = "/api/v1"

const LABEL_KEY_LABELS: Record<string, string> = {
  dearPrefix: "Dear prefix (e.g. Dear / Kepada)",
  to: "To: (envelope)",
  dearGuest: "Dear Guest (fallback)",
  tapSealToOpen: "Tap the seal to open",
  saveTheDate: "Save the Date",
  venue: "Venue",
  gallery: "Gallery",
  wishes: "Wishes",
  visibleToAllGuests: "Visible to all guests",
  rsvp: "RSVP",
  rsvpDefaultMessage: "RSVP default message",
  pleaseRespondBy: "Please respond by",
  attending: "Attending",
  notAttending: "Not Attending",
  addToCalendar: "Add to Calendar",
  refresh: "Refresh",
  call: "Call",
  music: "Music",
  map: "Map",
  maps: "Maps",
  waze: "Waze",
}

export default function AdminConfigPage() {
  const { toast } = useToast()
  const [cardLanguages, setCardLanguages] = useState<CardLanguage[]>([])
  const [packages, setPackages] = useState<Package[]>([])
  const [labelTranslations, setLabelTranslations] = useState<LabelTranslations>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchConfig()
      .then((c) => {
        setCardLanguages(c.cardLanguages ?? [])
        setPackages(c.packages ?? [])
        setLabelTranslations(c.labelTranslations ?? {})
      })
      .catch(() => toast({ title: "Failed to load config", variant: "destructive" }))
      .finally(() => setLoading(false))
  }, [toast])

  function updateLabel(langCode: string, key: string, value: string) {
    setLabelTranslations((prev) => {
      const next = { ...prev }
      if (!next[langCode]) next[langCode] = {}
      next[langCode] = { ...next[langCode], [key]: value }
      return next
    })
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch(`${API_BASE}/admin/config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ cardLanguages, packages, labelTranslations }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error((data as { error?: string }).error ?? `Failed: ${res.status}`)
      }
      toast({ title: "Config saved" })
    } catch (e) {
      toast({ title: "Save failed", description: String(e), variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  function addLanguage() {
    setCardLanguages((prev) => [...prev, { value: "", label: "" }])
  }

  function updateLanguage(i: number, field: "value" | "label", val: string) {
    setCardLanguages((prev) => {
      const next = [...prev]
      next[i] = { ...next[i], [field]: val }
      return next
    })
  }

  function removeLanguage(i: number) {
    setCardLanguages((prev) => prev.filter((_, idx) => idx !== i))
  }

  function addPackage() {
    setPackages((prev) => [...prev, { value: "", label: "" }])
  }

  function updatePackage(i: number, field: "value" | "label" | "isPopular", val: string | boolean) {
    setPackages((prev) => {
      const next = [...prev]
      if (field === "isPopular") {
        next[i] = { ...next[i], isPopular: val as boolean }
      } else {
        next[i] = { ...next[i], [field]: val }
      }
      return next
    })
  }

  function removePackage(i: number) {
    setPackages((prev) => prev.filter((_, idx) => idx !== i))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="size-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold tracking-tight">App Config</h1>
      <p className="text-sm text-muted-foreground">
        Manage card languages and packages shown in the studio.
      </p>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">Card Languages</h2>
          <Button variant="outline" size="sm" onClick={addLanguage}>
            <Plus className="size-4" />
            Add
          </Button>
        </div>
        <div className="space-y-3">
          {cardLanguages.map((lang, i) => (
            <div key={i} className="flex gap-2">
              <Input
                placeholder="value (e.g. english)"
                value={lang.value}
                onChange={(e) => updateLanguage(i, "value", e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="label (e.g. English)"
                value={lang.label}
                onChange={(e) => updateLanguage(i, "label", e.target.value)}
                className="flex-1"
              />
              <Button variant="ghost" size="icon" onClick={() => removeLanguage(i)}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">Packages</h2>
          <Button variant="outline" size="sm" onClick={addPackage}>
            <Plus className="size-4" />
            Add
          </Button>
        </div>
        <div className="space-y-3">
          {packages.map((pkg, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Input
                placeholder="value (e.g. gold)"
                value={pkg.value}
                onChange={(e) => updatePackage(i, "value", e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="label (e.g. Gold)"
                value={pkg.label}
                onChange={(e) => updatePackage(i, "label", e.target.value)}
                className="flex-1"
              />
              <label className="flex items-center gap-2 whitespace-nowrap text-xs">
                <input
                  type="checkbox"
                  checked={!!pkg.isPopular}
                  onChange={(e) => updatePackage(i, "isPopular", e.target.checked)}
                />
                Popular
              </label>
              <Button variant="ghost" size="icon" onClick={() => removePackage(i)}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium">Label Translations</h2>
        <p className="text-xs text-muted-foreground">
          Per-language labels for invitation UI (e.g. &quot;Dear&quot; vs &quot;Kepada&quot;). Use language values from Card Languages.
        </p>
        <div className="space-y-6">
          {(cardLanguages.length > 0 ? cardLanguages.map((l) => l.value) : ["english"]).map((langCode) => (
            <div key={langCode} className="rounded-lg border border-border p-4">
              <h3 className="mb-3 text-xs font-medium uppercase text-muted-foreground">{langCode}</h3>
              <div className="space-y-2">
                {LABEL_KEYS.map((key) => (
                  <div key={key} className="flex items-center gap-2">
                    <Label className="w-48 shrink-0 text-xs" htmlFor={`${langCode}-${key}`}>
                      {LABEL_KEY_LABELS[key] ?? key}
                    </Label>
                    <Input
                      id={`${langCode}-${key}`}
                      value={labelTranslations[langCode]?.[key] ?? ""}
                      onChange={(e) => updateLabel(langCode, key, e.target.value)}
                      placeholder={langCode === "english" ? "English default" : ""}
                      className="flex-1 text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Saving…" : "Save"}
      </Button>
    </div>
  )
}
