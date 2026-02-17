"use client"

import { useState, useMemo } from "react"
import { Search, Crown, Eye, X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  TEMPLATES,
  EVENT_THEMES,
  STYLE_TAGS,
  type Template,
  type EventTheme,
  type StyleTag,
  type Tier,
} from "@/lib/templates"

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

export interface SelectedTemplate {
  id: string
  name: string
  thumbnail: string
  colors: { bg: string; text: string; accent: string; muted: string }
  design: Template["design"]
}

interface ChooseDesignModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectTemplate: (template: SelectedTemplate) => void
  selectedTemplateId?: string
}

/* ------------------------------------------------------------------ */
/*  Filter chip                                                        */
/* ------------------------------------------------------------------ */

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center rounded-full border px-3 py-1 text-xs font-medium transition-all",
        active
          ? "border-foreground bg-foreground text-primary-foreground"
          : "border-border bg-card text-foreground hover:border-foreground/30"
      )}
    >
      {label}
    </button>
  )
}

/* ------------------------------------------------------------------ */
/*  Mini phone preview                                                 */
/* ------------------------------------------------------------------ */

function MiniPhonePreview({
  template,
  onClose,
}: {
  template: Template
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative flex flex-col items-center gap-4">
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 flex size-8 items-center justify-center rounded-full bg-card text-foreground shadow-md hover:bg-secondary"
          aria-label="Close preview"
        >
          <X className="size-4" />
        </button>
        <div className="w-[220px] rounded-[30px] border-[5px] border-neutral-800 bg-neutral-800 shadow-2xl">
          <div className="relative w-full overflow-hidden rounded-[25px]">
            <div className="absolute top-0 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rounded-b-xl bg-neutral-800" />
            <div className="relative aspect-[9/16] w-full" style={{ background: template.colors.bg }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={template.thumbnail} alt={template.name} className="size-full object-cover" />
            </div>
            <div className="absolute bottom-1 left-1/2 h-1 w-16 -translate-x-1/2 rounded-full bg-white/30" />
          </div>
        </div>
        <p className="text-sm font-medium text-white">{template.name}</p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Template card                                                      */
/* ------------------------------------------------------------------ */

function TemplateCard({
  template,
  isSelected,
  onSelect,
  onPreview,
}: {
  template: Template
  isSelected: boolean
  onSelect: () => void
  onPreview: () => void
}) {
  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all",
        isSelected
          ? "border-foreground ring-2 ring-foreground/10"
          : "border-border hover:border-foreground/20 hover:shadow-sm"
      )}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-secondary">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={template.thumbnail}
          alt={template.name}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {template.tier === "premium" && (
          <div className="absolute top-2 right-2">
            <Badge className="gap-1 border-none bg-foreground/80 px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
              <Crown className="size-2.5" /> Premium
            </Badge>
          </div>
        )}
        {isSelected && (
          <div className="absolute top-2 left-2 flex size-5 items-center justify-center rounded-full bg-foreground">
            <svg className="size-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
          <Button
            variant="secondary"
            size="sm"
            className="h-8 gap-1.5 text-xs shadow-lg"
            onClick={(e) => { e.stopPropagation(); onPreview() }}
          >
            <Eye className="size-3" /> Preview
          </Button>
          <Button
            size="sm"
            className="h-8 text-xs shadow-lg"
            onClick={(e) => { e.stopPropagation(); onSelect() }}
          >
            Select
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 p-3">
        <h3 className="text-sm font-medium leading-tight text-foreground">{template.name}</h3>
        <div className="flex flex-wrap gap-1">
          {template.themes.slice(0, 2).map((theme) => (
            <Badge key={theme} variant="secondary" className="px-1.5 py-0 text-[10px] font-normal text-muted-foreground">
              {theme}
            </Badge>
          ))}
          {template.styles.slice(0, 1).map((style) => (
            <Badge key={style} variant="outline" className="px-1.5 py-0 text-[10px] font-normal text-muted-foreground">
              {style}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main modal                                                         */
/* ------------------------------------------------------------------ */

export function ChooseDesignModal({
  open,
  onOpenChange,
  onSelectTemplate,
  selectedTemplateId,
}: ChooseDesignModalProps) {
  const [search, setSearch] = useState("")
  const [selectedTheme, setSelectedTheme] = useState<EventTheme | null>(null)
  const [selectedStyle, setSelectedStyle] = useState<StyleTag | null>(null)
  const [tierFilter, setTierFilter] = useState<Tier | "all">("all")
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)

  const filtered = useMemo(() => {
    return TEMPLATES.filter((t) => {
      if (selectedTheme && !t.themes.includes(selectedTheme)) return false
      if (selectedStyle && !t.styles.includes(selectedStyle)) return false
      if (tierFilter !== "all" && t.tier !== tierFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        const haystack = [t.name, ...t.tags, ...t.themes, ...t.styles].join(" ").toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [search, selectedTheme, selectedStyle, tierFilter])

  function handleSelect(template: Template) {
    onSelectTemplate({
      id: template.id,
      name: template.name,
      thumbnail: template.thumbnail,
      colors: template.colors,
      design: template.design,
    })
    onOpenChange(false)
  }

  function clearFilters() {
    setSearch("")
    setSelectedTheme(null)
    setSelectedStyle(null)
    setTierFilter("all")
  }

  const hasActiveFilters = search.trim() !== "" || selectedTheme !== null || selectedStyle !== null || tierFilter !== "all"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[85vh] max-h-[700px] w-[calc(100%-2rem)] max-w-5xl flex-col gap-0 overflow-hidden p-0">
        <div className="shrink-0 border-b border-border px-5 py-4 sm:px-6">
          <DialogHeader>
            <DialogTitle className="text-lg tracking-tight">Choose a Design</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Browse our curated collection of invitation templates
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          {/* Desktop sidebar */}
          <aside className="hidden shrink-0 border-r border-border lg:flex lg:w-[220px] lg:flex-col">
            <ScrollArea className="flex-1 px-5 py-4">
              <div className="flex flex-col gap-5">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search templates..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-8 pl-8 text-xs"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">Event Theme</span>
                  <div className="flex flex-wrap gap-1.5">
                    {EVENT_THEMES.map((theme) => (
                      <FilterChip key={theme} label={theme} active={selectedTheme === theme} onClick={() => setSelectedTheme(selectedTheme === theme ? null : theme)} />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">Style</span>
                  <div className="flex flex-wrap gap-1.5">
                    {STYLE_TAGS.map((style) => (
                      <FilterChip key={style} label={style} active={selectedStyle === style} onClick={() => setSelectedStyle(selectedStyle === style ? null : style)} />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">Tier</span>
                  <div className="flex gap-1.5">
                    {(["all", "free", "premium"] as const).map((tier) => (
                      <FilterChip key={tier} label={tier === "all" ? "All" : tier === "free" ? "Free" : "Premium"} active={tierFilter === tier} onClick={() => setTierFilter(tier)} />
                    ))}
                  </div>
                </div>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" onClick={clearFilters}>
                    Clear all filters
                  </Button>
                )}
              </div>
            </ScrollArea>
          </aside>

          {/* Mobile filters */}
          <div className="flex shrink-0 flex-col gap-2.5 border-b border-border px-4 py-3 lg:hidden">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 pl-8 text-xs" />
            </div>
            <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {EVENT_THEMES.map((theme) => (
                <FilterChip key={theme} label={theme} active={selectedTheme === theme} onClick={() => setSelectedTheme(selectedTheme === theme ? null : theme)} />
              ))}
            </div>
            <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {STYLE_TAGS.map((style) => (
                <FilterChip key={style} label={style} active={selectedStyle === style} onClick={() => setSelectedStyle(selectedStyle === style ? null : style)} />
              ))}
              <div className="mx-1 h-6 w-px shrink-0 bg-border" />
              {(["all", "free", "premium"] as const).map((tier) => (
                <FilterChip key={tier} label={tier === "all" ? "All" : tier === "free" ? "Free" : "Premium"} active={tierFilter === tier} onClick={() => setTierFilter(tier)} />
              ))}
            </div>
          </div>

          {/* Grid */}
          <ScrollArea className="flex-1">
            <div className="px-4 py-4 sm:px-5">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-sm font-medium text-foreground">No templates found</p>
                  <p className="mt-1 text-xs text-muted-foreground">Try adjusting your filters</p>
                  {hasActiveFilters && (
                    <Button variant="outline" size="sm" className="mt-4 h-8 text-xs" onClick={clearFilters}>Clear filters</Button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <p className="text-xs text-muted-foreground">{filtered.length} template{filtered.length !== 1 ? "s" : ""}</p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((template) => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        isSelected={selectedTemplateId === template.id}
                        onSelect={() => handleSelect(template)}
                        onPreview={() => setPreviewTemplate(template)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {previewTemplate && (
          <MiniPhonePreview template={previewTemplate} onClose={() => setPreviewTemplate(null)} />
        )}
      </DialogContent>
    </Dialog>
  )
}
