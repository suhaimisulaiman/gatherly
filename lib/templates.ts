export type EventTheme =
  | "Wedding"
  | "E-Day"
  | "Birthday"
  | "Open House"
  | "Corporate"
  | "Baby/Aqiqah"

export type StyleTag =
  | "Minimal"
  | "Floral"
  | "Cute"
  | "Elegant"
  | "Traditional"
  | "Modern"

export type Tier = "free" | "premium"

export interface TemplateThemeColors {
  bg: string
  text: string
  accent: string
  muted: string
}

export interface Template {
  id: string
  name: string
  thumbnail: string
  themes: EventTheme[]
  styles: StyleTag[]
  tier: Tier
  tags: string[]
  colors: TemplateThemeColors
}

export const EVENT_THEMES: EventTheme[] = [
  "Wedding",
  "E-Day",
  "Birthday",
  "Open House",
  "Corporate",
  "Baby/Aqiqah",
]

export const STYLE_TAGS: StyleTag[] = [
  "Minimal",
  "Floral",
  "Cute",
  "Elegant",
  "Traditional",
  "Modern",
]

export const TEMPLATES: Template[] = [
  {
    id: "elegant-rose",
    name: "Elegant Rose",
    thumbnail: "/templates/elegant-rose.jpg",
    themes: ["Wedding"],
    styles: ["Floral", "Elegant"],
    tier: "premium",
    tags: ["rose", "blush", "romantic", "feminine"],
    colors: { bg: "#fdf2f4", text: "#4a2030", accent: "#c77d8a", muted: "#9c7080" },
  },
  {
    id: "golden-arch",
    name: "Golden Arch",
    thumbnail: "/templates/golden-arch.jpg",
    themes: ["Wedding", "E-Day"],
    styles: ["Elegant", "Modern"],
    tier: "premium",
    tags: ["gold", "arch", "art deco", "luxury"],
    colors: { bg: "#faf6ee", text: "#3a2e1a", accent: "#b8943e", muted: "#8a7d60" },
  },
  {
    id: "sakura-bloom",
    name: "Sakura Bloom",
    thumbnail: "/templates/sakura-bloom.jpg",
    themes: ["Birthday"],
    styles: ["Cute", "Floral"],
    tier: "free",
    tags: ["cherry blossom", "pink", "japanese", "spring"],
    colors: { bg: "#fef0f5", text: "#5c2040", accent: "#e891ab", muted: "#a87088" },
  },
  {
    id: "midnight-garden",
    name: "Midnight Garden",
    thumbnail: "/templates/midnight-garden.jpg",
    themes: ["Wedding", "E-Day"],
    styles: ["Elegant", "Modern"],
    tier: "premium",
    tags: ["dark", "botanical", "navy", "moody"],
    colors: { bg: "#0f1a2e", text: "#e8edf4", accent: "#5b8a72", muted: "#7a8ea0" },
  },
  {
    id: "corporate-slate",
    name: "Corporate Slate",
    thumbnail: "/templates/corporate-slate.jpg",
    themes: ["Corporate", "Open House"],
    styles: ["Minimal", "Modern"],
    tier: "free",
    tags: ["business", "professional", "clean", "formal"],
    colors: { bg: "#f5f5f5", text: "#1a1a2e", accent: "#4a6fa5", muted: "#6b7280" },
  },
  {
    id: "tropical-fiesta",
    name: "Tropical Fiesta",
    thumbnail: "/templates/tropical-fiesta.jpg",
    themes: ["Birthday", "Open House"],
    styles: ["Modern", "Cute"],
    tier: "free",
    tags: ["tropical", "party", "palm", "vibrant", "fun"],
    colors: { bg: "#fef9f0", text: "#2a1f14", accent: "#e07850", muted: "#8a7060" },
  },
  {
    id: "rustic-kraft",
    name: "Rustic Kraft",
    thumbnail: "/templates/rustic-kraft.jpg",
    themes: ["Wedding"],
    styles: ["Traditional", "Floral"],
    tier: "free",
    tags: ["rustic", "kraft", "botanical", "vintage", "wildflower"],
    colors: { bg: "#f5ede0", text: "#3e3428", accent: "#8b7355", muted: "#7a6e58" },
  },
  {
    id: "baby-clouds",
    name: "Baby Clouds",
    thumbnail: "/templates/baby-clouds.jpg",
    themes: ["Baby/Aqiqah"],
    styles: ["Cute", "Minimal"],
    tier: "premium",
    tags: ["baby", "shower", "aqiqah", "pastel", "dreamy"],
    colors: { bg: "#f0f6fc", text: "#2a3a50", accent: "#7ab0d4", muted: "#7090a8" },
  },
  {
    id: "islamic-geometric",
    name: "Islamic Geometric",
    thumbnail: "/templates/islamic-geometric.jpg",
    themes: ["Wedding", "E-Day", "Open House"],
    styles: ["Traditional", "Elegant"],
    tier: "premium",
    tags: ["islamic", "geometric", "arabesque", "ornate"],
    colors: { bg: "#f2f7f0", text: "#1a3020", accent: "#2e7d48", muted: "#507060" },
  },
]
