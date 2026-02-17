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

export interface Template {
  id: string
  name: string
  thumbnail: string
  themes: EventTheme[]
  styles: StyleTag[]
  tier: Tier
  tags: string[]
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
  },
  {
    id: "golden-arch",
    name: "Golden Arch",
    thumbnail: "/templates/golden-arch.jpg",
    themes: ["Wedding", "E-Day"],
    styles: ["Elegant", "Modern"],
    tier: "premium",
    tags: ["gold", "arch", "art deco", "luxury"],
  },
  {
    id: "sakura-bloom",
    name: "Sakura Bloom",
    thumbnail: "/templates/sakura-bloom.jpg",
    themes: ["Birthday"],
    styles: ["Cute", "Floral"],
    tier: "free",
    tags: ["cherry blossom", "pink", "japanese", "spring"],
  },
  {
    id: "midnight-garden",
    name: "Midnight Garden",
    thumbnail: "/templates/midnight-garden.jpg",
    themes: ["Wedding", "E-Day"],
    styles: ["Elegant", "Modern"],
    tier: "premium",
    tags: ["dark", "botanical", "navy", "moody"],
  },
  {
    id: "corporate-slate",
    name: "Corporate Slate",
    thumbnail: "/templates/corporate-slate.jpg",
    themes: ["Corporate", "Open House"],
    styles: ["Minimal", "Modern"],
    tier: "free",
    tags: ["business", "professional", "clean", "formal"],
  },
  {
    id: "tropical-fiesta",
    name: "Tropical Fiesta",
    thumbnail: "/templates/tropical-fiesta.jpg",
    themes: ["Birthday", "Open House"],
    styles: ["Modern", "Cute"],
    tier: "free",
    tags: ["tropical", "party", "palm", "vibrant", "fun"],
  },
  {
    id: "rustic-kraft",
    name: "Rustic Kraft",
    thumbnail: "/templates/rustic-kraft.jpg",
    themes: ["Wedding"],
    styles: ["Traditional", "Floral"],
    tier: "free",
    tags: ["rustic", "kraft", "botanical", "vintage", "wildflower"],
  },
  {
    id: "baby-clouds",
    name: "Baby Clouds",
    thumbnail: "/templates/baby-clouds.jpg",
    themes: ["Baby/Aqiqah"],
    styles: ["Cute", "Minimal"],
    tier: "premium",
    tags: ["baby", "shower", "aqiqah", "pastel", "dreamy"],
  },
  {
    id: "islamic-geometric",
    name: "Islamic Geometric",
    thumbnail: "/templates/islamic-geometric.jpg",
    themes: ["Wedding", "E-Day", "Open House"],
    styles: ["Traditional", "Elegant"],
    tier: "premium",
    tags: ["islamic", "geometric", "arabesque", "ornate"],
  },
]
