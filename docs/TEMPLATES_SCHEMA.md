# Templates Schema & Data Flow

Design for backend-managed invitation templates (designs), including default audio per template.

---

## 1. Database Schema

### Table: `templates`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | text | PRIMARY KEY | Slug-style ID (e.g. `elegant-rose`, `golden-arch`) |
| `name` | text | NOT NULL | Display name (e.g. "Elegant Rose") |
| `thumbnail_url` | text | NOT NULL | URL to thumbnail image (public path or Supabase Storage) |
| `themes` | text[] | NOT NULL DEFAULT '{}' | Event themes: Wedding, E-Day, Birthday, etc. |
| `styles` | text[] | NOT NULL DEFAULT '{}' | Style tags: Minimal, Floral, Elegant, etc. |
| `tier` | text | NOT NULL DEFAULT 'free' | `free` or `premium` |
| `tags` | text[] | NOT NULL DEFAULT '{}' | Searchable tags (e.g. `["rose","blush","romantic"]`) |
| `colors` | jsonb | NOT NULL | `{ bg, text, accent, muted }` hex values |
| `design` | jsonb | NOT NULL | Font, layout, decorator config (see below) |
| `envelope_intro` | jsonb | NULL | Optional envelope block config |
| `default_audio_url` | text | NULL | Default background music (e.g. YouTube URL) |
| `sort_order` | int | NOT NULL DEFAULT 0 | Display order in picker |
| `active` | boolean | NOT NULL DEFAULT true | Soft disable for admins |
| `created_at` | timestamptz | NOT NULL DEFAULT now() | |
| `updated_at` | timestamptz | NOT NULL DEFAULT now() | |

### JSONB shapes (align with `lib/templates.ts` types)

**colors**
```json
{
  "bg": "#fdf2f4",
  "text": "#4a2030",
  "accent": "#c77d8a",
  "muted": "#9c7080"
}
```

**design**
```json
{
  "fontPairing": "serif",
  "headingWeight": "400",
  "letterSpacing": "0.04em",
  "decorator": "floral-corners",
  "heroLayout": "centered",
  "divider": "ornament",
  "bgPattern": "radial-gradient(...)",
  "borderRadius": "16px",
  "accentShape": "circle"
}
```

**envelope_intro** (nullable)
```json
{
  "type": "envelopeIntro",
  "variant": "classicWax",
  "sealInitials": "SA"
}
```

### RLS

- **SELECT**: Public (anyone can read active templates)
- **INSERT / UPDATE / DELETE**: Admin only (service role in admin API)

---

## 2. Asset Storage

| Asset | Strategy | Notes |
|-------|----------|-------|
| **Thumbnail** | Supabase Storage or `/public/templates/` | Store URL in `thumbnail_url`. Migration: keep `/templates/*.svg` in public initially; later support uploads to Storage. |
| **Design SVGs** | `/public/templates/` (unchanged) | Full design artwork. Template `id` maps to `public/templates/{id}.svg`. No DB column needed if path is deterministic. |

**Recommendation**: Start with thumbnails and SVGs in `/public/templates/`; `thumbnail_url` = `/templates/{id}.svg` (or a separate `{id}-thumb.png`). Add Storage-backed upload later in admin UI.

---

## 3. API Design

### Public APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/config` | None | Returns `cardLanguages`, `packages`, `templates`. Templates join config for studio bootstrap. |
| GET | `/api/v1/templates` | None | List all active templates. Used by choose-design modal, studio, public page. |
| GET | `/api/v1/templates/[id]` | None | Single template by id. Used when rendering an invitation with `template_id`. |

### Admin APIs

| Method | Endpoint | Auth | Description |
|--------|----------|------| Admin only |
| GET | `/api/v1/admin/templates` | Admin | List all (including inactive) |
| POST | `/api/v1/admin/templates` | Admin | Create template |
| PUT | `/api/v1/admin/templates/[id]` | Admin | Update template |
| DELETE | `/api/v1/admin/templates/[id]` | Admin | Soft delete (set `active = false`) or hard delete |

### Response shape (single template)

```ts
{
  id: string
  name: string
  thumbnail: string
  themes: string[]
  styles: string[]
  tier: "free" | "premium"
  tags: string[]
  colors: { bg, text, accent, muted }
  design: TemplateDesign
  envelopeIntro?: EnvelopeIntroBlockConfig
  defaultAudioUrl: string | null   // Mapped from default_audio_url
}
```

---

## 4. Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATABASE                                        │
│  templates (id, name, thumbnail_url, themes, styles, tier, tags, colors,     │
│            design, envelope_intro, default_audio_url, sort_order, active)    │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    ▼                   ▼                   ▼
         ┌──────────────────┐ ┌─────────────────┐ ┌──────────────────┐
         │ GET /api/v1/     │ │ GET /api/v1/    │ │ Admin APIs       │
         │ config           │ │ templates       │ │ (CRUD templates)  │
         │ (templates       │ │ (list/by id)    │ │                  │
         │  in config)      │ │                 │ │                  │
         └────────┬─────────┘ └────────┬────────┘ └──────────────────┘
                  │                    │
                  ▼                    ▼
         ┌──────────────────────────────────────────────────────────────────┐
         │                         FRONTEND                                   │
         │                                                                   │
         │  • /studio          → fetchConfig() → templates in ChooseDesign   │
         │  • ChooseDesignModal → templates → filter, select                 │
         │  • StudioWizard     → selectedTemplate.defaultAudioUrl → prefill  │
         │                       background music when template changes      │
         │  • /i/[slug]        → fetchInvitationBySlug + fetchTemplate(id)   │
         │                       → render with template + content            │
         │  • /admin/templates → admin UI to manage templates                │
         └──────────────────────────────────────────────────────────────────┘
```

### Flow details

1. **Studio (Step 1)**  
   - Fetch config (includes templates, or fetch templates separately).  
   - ChooseDesignModal shows templates from API.  
   - When user selects template, if `defaultAudioUrl` exists → prefill `backgroundMusicYoutubeUrl` in step1Options.

2. **Invitation creation/editing**  
   - `invitations.template_id` references `templates.id`.  
   - No template JSON stored in invitations; always resolved at read time.

3. **Public invitation page** (`/i/[slug]`)  
   - Fetch invitation → get `template_id`.  
   - Fetch template by id (or from cached templates list).  
   - Pass template (colors, design, envelopeIntro) + invitation content to InvitationPreview.

4. **Default audio**  
   - Stored in `templates.default_audio_url`.  
   - Studio: when template is selected, if `defaultAudioUrl` is set, auto-fill background music URL.  
   - Public page: use content’s `backgroundMusicYoutubeUrl` if present (saved from studio); otherwise optional fallback to template default.

---

## 5. Migration from hardcoded templates

1. Create migration `00003_templates.sql` with table + RLS.  
2. Seed from `lib/templates.ts`: script or migration INSERT from current TEMPLATES array.  
3. Add `default_audio_url` for wedding templates (e.g. current WEDDING_DEFAULT_MUSIC_URL).  
4. Implement `GET /api/v1/templates` and optionally extend `GET /api/v1/config` to include templates.  
5. Update frontend: replace `TEMPLATES` import with `fetchTemplates()` / config.  
6. Add admin UI for templates (later phase).

---

## 6. Invitations FK (optional hardening)

Current: `invitations.template_id` is plain text. Add a check constraint or FK:

```sql
-- Option: FK (templates must exist)
ALTER TABLE invitations
  ADD CONSTRAINT fk_invitations_template
  FOREIGN KEY (template_id) REFERENCES templates(id)
  ON DELETE RESTRICT;
```

Or keep as text for flexibility (e.g. support templates from external source); validate at API layer that `template_id` exists before save.
