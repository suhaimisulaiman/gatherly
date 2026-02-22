/**
 * Server-side app config. Reads from DB (app_config table), falls back to defaults.
 */

import { createClient } from "@/lib/supabase/server"

export type CardLanguage = { value: string; label: string }

export type Package = { value: string; label: string; isPopular?: boolean }

const DEFAULT_CARD_LANGUAGES: CardLanguage[] = [
  { value: "bahasa-melayu", label: "Bahasa Melayu" },
  { value: "english", label: "English" },
  { value: "arabic", label: "Arabic" },
]

const DEFAULT_PACKAGES: Package[] = [
  { value: "standard", label: "Standard" },
  { value: "premium", label: "Premium" },
  { value: "gold", label: "Gold", isPopular: true },
]

async function getConfigKey<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("app_config")
      .select("value")
      .eq("key", key)
      .single()
    if (error || !data?.value) return defaultValue
    return data.value as T
  } catch {
    return defaultValue
  }
}

export async function getCardLanguages(): Promise<CardLanguage[]> {
  const stored = await getConfigKey<CardLanguage[]>("card_languages", [])
  if (Array.isArray(stored) && stored.length > 0) return stored
  return DEFAULT_CARD_LANGUAGES
}

export async function getPackages(): Promise<Package[]> {
  const stored = await getConfigKey<Package[]>("packages", [])
  if (Array.isArray(stored) && stored.length > 0) return stored
  return DEFAULT_PACKAGES
}

export type LabelTranslations = Record<string, Record<string, string>>

const DEFAULT_LABEL_TRANSLATIONS: LabelTranslations = {
  english: {
    dearPrefix: "Dear",
    to: "To:",
    dearGuest: "Dear Guest",
    tapSealToOpen: "Tap the seal to open",
    saveTheDate: "Save the Date",
    venue: "Venue",
    gallery: "Gallery",
    wishes: "Wishes",
    visibleToAllGuests: "Visible to all guests",
    rsvp: "RSVP",
    rsvpDefaultMessage: "Please let us know if you can make it!",
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
  },
  "bahasa-melayu": {
    dearPrefix: "Kepada",
    to: "Kepada:",
    dearGuest: "Kepada Tetamu",
    tapSealToOpen: "Sentuh mohor untuk membuka",
    saveTheDate: "Jimat Tarikh",
    venue: "Lokasi",
    gallery: "Galeri",
    wishes: "Ucapan",
    visibleToAllGuests: "Boleh dilihat oleh semua tetamu",
    rsvp: "RSVP",
    rsvpDefaultMessage: "Sila maklumkan jika anda dapat hadir!",
    pleaseRespondBy: "Sila balas sebelum",
    attending: "Akan Hadir",
    notAttending: "Tidak Dapat Hadir",
    addToCalendar: "Tambah ke Kalendar",
    refresh: "Muat Semula",
    call: "Panggil",
    music: "Muzik",
    map: "Peta",
    maps: "Maps",
    waze: "Waze",
  },
}

export async function getLabelTranslations(): Promise<LabelTranslations> {
  const stored = await getConfigKey<LabelTranslations>("label_translations", {})
  if (stored && typeof stored === "object" && Object.keys(stored).length > 0) return stored
  return DEFAULT_LABEL_TRANSLATIONS
}
