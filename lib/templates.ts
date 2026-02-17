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

export type FontPairing = "serif" | "sans" | "script"
export type DecoratorStyle = "none" | "floral-corners" | "geometric-border" | "dots-scatter" | "line-minimal" | "star-scatter" | "wave-divider" | "arabesque-frame"
export type HeroLayout = "centered" | "left-aligned" | "split"
export type DividerStyle = "line" | "ornament" | "dots" | "diamond" | "none"

export interface TemplateDesign {
  fontPairing: FontPairing
  headingWeight: string
  letterSpacing: string
  decorator: DecoratorStyle
  heroLayout: HeroLayout
  divider: DividerStyle
  bgPattern: string | null        // CSS background pattern overlay
  borderRadius: string             // card corner style
  accentShape: "circle" | "square" | "diamond" | "arch"
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
  design: TemplateDesign
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
    design: {
      fontPairing: "serif",
      headingWeight: "400",
      letterSpacing: "0.04em",
      decorator: "floral-corners",
      heroLayout: "centered",
      divider: "ornament",
      bgPattern: "radial-gradient(circle at 20% 20%, #c77d8a10 0%, transparent 50%), radial-gradient(circle at 80% 80%, #c77d8a10 0%, transparent 50%)",
      borderRadius: "16px",
      accentShape: "circle",
    },
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
    design: {
      fontPairing: "serif",
      headingWeight: "600",
      letterSpacing: "0.06em",
      decorator: "geometric-border",
      heroLayout: "centered",
      divider: "diamond",
      bgPattern: null,
      borderRadius: "0px",
      accentShape: "arch",
    },
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
    design: {
      fontPairing: "sans",
      headingWeight: "600",
      letterSpacing: "0.02em",
      decorator: "dots-scatter",
      heroLayout: "centered",
      divider: "dots",
      bgPattern: "radial-gradient(circle at 15% 10%, #e891ab15 0%, transparent 30%), radial-gradient(circle at 85% 15%, #e891ab12 0%, transparent 25%), radial-gradient(circle at 50% 90%, #e891ab10 0%, transparent 35%)",
      borderRadius: "20px",
      accentShape: "circle",
    },
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
    design: {
      fontPairing: "serif",
      headingWeight: "400",
      letterSpacing: "0.05em",
      decorator: "line-minimal",
      heroLayout: "centered",
      divider: "line",
      bgPattern: "linear-gradient(180deg, #5b8a7208 0%, transparent 30%, transparent 70%, #5b8a7208 100%)",
      borderRadius: "12px",
      accentShape: "diamond",
    },
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
    design: {
      fontPairing: "sans",
      headingWeight: "700",
      letterSpacing: "0.01em",
      decorator: "line-minimal",
      heroLayout: "left-aligned",
      divider: "line",
      bgPattern: null,
      borderRadius: "8px",
      accentShape: "square",
    },
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
    design: {
      fontPairing: "sans",
      headingWeight: "700",
      letterSpacing: "0.01em",
      decorator: "dots-scatter",
      heroLayout: "centered",
      divider: "dots",
      bgPattern: "radial-gradient(circle at 10% 90%, #e0785012 0%, transparent 40%), radial-gradient(circle at 90% 10%, #e0785012 0%, transparent 40%)",
      borderRadius: "16px",
      accentShape: "circle",
    },
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
    design: {
      fontPairing: "serif",
      headingWeight: "400",
      letterSpacing: "0.03em",
      decorator: "floral-corners",
      heroLayout: "centered",
      divider: "ornament",
      bgPattern: null,
      borderRadius: "4px",
      accentShape: "square",
    },
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
    design: {
      fontPairing: "sans",
      headingWeight: "600",
      letterSpacing: "0.02em",
      decorator: "star-scatter",
      heroLayout: "centered",
      divider: "dots",
      bgPattern: "radial-gradient(circle at 30% 20%, #7ab0d412 0%, transparent 35%), radial-gradient(circle at 70% 75%, #7ab0d410 0%, transparent 30%)",
      borderRadius: "24px",
      accentShape: "circle",
    },
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
    design: {
      fontPairing: "serif",
      headingWeight: "600",
      letterSpacing: "0.04em",
      decorator: "arabesque-frame",
      heroLayout: "centered",
      divider: "diamond",
      bgPattern: null,
      borderRadius: "2px",
      accentShape: "arch",
    },
  },
]
