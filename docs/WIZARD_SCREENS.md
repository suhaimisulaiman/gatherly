# Gatherly — Wizard Screens Documentation

This document outlines the planned screens and content for the Gatherly invitation wizard flow.

---

## Overview

| Screen | Name | Route | Status |
|--------|------|-------|--------|
| 1 | Choose Design | `/` | ✅ Implemented |
| 2 | Event Details | `/events/[eventId]/studio` | ✅ Implemented |
| 3 | Event Agenda | — | ✅ Implemented |
| 4 | Venue | — | ✅ Implemented |
| 5 | Gallery | — | ✅ Implemented |
| 6 | Wishes | — | ✅ Implemented |
| 7 | RSVP Settings | — | ✅ Implemented |
| 8 | Extras / Add-ons | — | Planned |
| 9 | Review & Preview | — | Planned |
| 10 | Success / Share | — | Planned |

---

## Screen 1: Choose Design

**Purpose:** Select the invitation template/theme and configure initial add-ons.

### Content
| Element | Description |
|---------|-------------|
| Template grid | Browse and select from available designs (e.g. Sakura Bloom, Elegant Rose, Kids Jungle) |
| Filters | Event theme, style tag |
| Search | Search templates by name or tags |
| Design selection | Choose Design button — shows selected template or prompts to browse |
| **Add-ons** | **Background Music** (toggle; when on, paste YouTube video link for ambient audio; wedding templates default to a preset link starting at 0:07) |
| Card Language | Bahasa Melayu, English, Arabic |
| Package | Standard, Premium, Gold |
| Opening Style | Circle Gate, Window |
| Animated Effect | None, Floating Dots, Confetti |
| Live preview | Phone frame showing selected template with add-ons applied |
| Next button | Enabled only after a design is selected |

### Navigation
- **Next** → Screen 2 (Event Details)
- Selected design and add-on settings are carried to subsequent screens.

---

## Screen 2: Event Details (Title & Greeting)

**Purpose:** Set the main headline and greeting.

### Content
| Element | Description |
|---------|-------------|
| Left panel | Form fields only |
| Right panel | Invitation preview (phone frame) |
| Event Type | Input (free text) — e.g. Walimatul Urus / Wedding Ceremony, Birthday |
| Invitation Title | Input (required, min 3 chars) — e.g. "Adam & Hawa", "Sayf Turns One!" |
| Event Date | Date picker — e.g. 20 September 2026 |
| Add equivalent Hijri date | Checkbox — show Islamic calendar date alongside Gregorian |
| Short Greeting | Input (optional) — e.g. "Join us to celebrate", "You're invited" |

### Live Preview Binding
- Hero: greeting + title
- Updates instantly as user types

### Persistence
- Autosave to `localStorage` key `draft:{eventId}` (debounced 1s)
- Save status indicator: Saving… / Saved

### Navigation
- **Back** → Screen 1 (Choose Design)
- **Next** → Screen 3 (Date & Time)

---

## Screen 3: Event Agenda

**Purpose:** Configure and display the event schedule/agenda.

### Content
| Element | Description |
|---------|--------------|
| Agenda items | Add/remove list of schedule items |
| Per item | Time picker + Title (e.g. "Arrival", "Ceremony", "Dinner") |
| Add agenda item | Button to append new items |

### Live Preview
- Date & Time section shows the event date (from Screen 2) plus the agenda list
- Each agenda item displays time (12h format) and title
- If no agenda items, falls back to placeholder time range

### Persistence
- Autosave to `draft:{eventId}` with `eventAgenda` array

### Navigation
- **Back** → Screen 2
- **Next** → Screen 4

---

## Screen 4: Venue

**Purpose:** Set event location and map links.

### Content
| Field | Type | Description |
|-------|------|-------------|
| Venue name | Input | e.g. "The Grand Pavilion" |
| Address | Textarea | Full address |
| Google Maps link | Input | URL for Maps |
| Waze link | Input | URL for Waze |

### Live Preview
- Venue section shows venue name, address, and Maps/Waze buttons when links are provided

### Persistence
- Autosave to `draft:{eventId}` with venueName, address, googleMapsLink, wazeLink

### Navigation
- **Back** → Screen 3
- **Next** → Screen 5

---

## Screen 5: Gallery

**Purpose:** Add photos to the invitation.

### Content
| Field | Type | Description |
|-------|------|-------------|
| Photos | Upload | Select images (max 20), resized/compressed for draft |
| Remove | Per-photo button | Remove individual photos |

### Live Preview
- Gallery section shows uploaded photos in grid (first photo spans 2 cols)
- Falls back to placeholder images when no photos

### Persistence
- Autosave to `draft:{eventId}` with `galleryPhotos` (base64 data URLs)

### Navigation
- **Back** → Screen 4
- **Next** → Screen 6

---

## Screen 6: Wishes

**Purpose:** Configure wishes/messages from guests (optional).

### Content
| Field | Type | Description |
|-------|------|-------------|
| Enable wishes section | Toggle | Show/hide wishes block; when on, guests can post |
| Featured wishes | List | Optional sample wishes (name + message) for preview |

### Guest posting
- When wishes enabled and eventId present, guests see a form (name, message, Post Wish)
- Wishes stored in `localStorage` key `wishes:{eventId}`

### Live Preview
- Wishes section shows featured + guest wishes; form appears in studio preview

### Navigation
- **Back** → Screen 5
- **Next** → Screen 7

---

## Screen 7: RSVP Settings

**Purpose:** Configure how guests respond.

### Content
| Field | Type | Description |
|-------|------|-------------|
| RSVP mode | Select | Guest List (named invites) / Open (link) |
| Maximum guests | Number | Optional — total capacity |
| Max guests per invitee | Number | Extra guests each invitee can bring (0 = none) |
| RSVP deadline | Date picker | Optional |
| Custom RSVP message | Textarea | Optional |

### Guest flow
- Guests can update their RSVP response anytime (Change response)
- When attending and host allows extras, guest must specify how many (0 to max)
- Response stored in `localStorage` key `rsvp:{eventId}:{guestSlug}`

### Live Preview
- RSVP section shows custom message, deadline, Attending/Not Attending, extra guests (when allowed), and Change response

### Persistence
- Host: `draft:{eventId}` with rsvpMode, maxGuests, maxGuestsPerInvitee, rsvpDeadline, rsvpMessage
- Guest: `rsvp:{eventId}:{guestSlug}` with response and extraGuests

### Navigation
- **Back** → Screen 6
- **Next** → Screen 8

---

## Screen 8: Extras / Add-ons

**Purpose:** Optional enhancements and settings.

> **Note:** Music, opening style, and animated effects are currently on Screen 1. Screen 8 is the planned location when the full wizard is implemented; these may be consolidated here for a cleaner flow.

### Content
| Field | Type | Description |
|-------|------|-------------|
| Background music | Toggle + YouTube link | Add ambient audio from a YouTube video |
| Animated effects | Select | None, Floating Dots, Confetti |
| Opening style | Select | Circle Gate, Window |
| Card language | Select | English, Arabic, French |
| Package type | Select | Standard, Premium, Gold |

### Live Preview
- Effects and styles applied to preview.

### Navigation
- **Back** → Screen 7
- **Next** → Screen 9

---

## Screen 9: Review & Preview

**Purpose:** Final check before publishing.

### Content
| Element | Description |
|---------|-------------|
| Full preview | Complete invitation in phone frame |
| Summary checklist | Design, title, date, venue, etc. |
| Edit shortcuts | Quick links to earlier screens |

### Navigation
- **Back** → Screen 8
- **Publish** → Screen 10

---

## Screen 10: Success / Share

**Purpose:** Invitation created and ready to share.

### Content
| Element | Description |
|---------|-------------|
| Success message | "Invitation created" |
| Share link | Copy link, WhatsApp, etc. |
| View invitation | Open full invitation |
| Create another | Start new invitation |

---

## Technical Notes

### Routes
- **Screen 1:** `/` (home)
- **Screen 2+:** `/events/[eventId]/studio` (with step state)

### State & Persistence
- **Design:** Stored in `sessionStorage` key `studio:selectedTemplate` when navigating Step 1 → Step 2
- **Event content:** Stored in `localStorage` key `draft:{eventId}` with debounced autosave
- **Guests:** No login required; recipient names resolved at runtime for guest list mode

### Components
- `StudioWizard` — Main wizard container
- `Step2EventDetails` — Screen 2 form (event details, title, greeting)
- `Step3EventAgenda` — Screen 3 form (agenda configuration)
- `Step4Venue` — Screen 4 form (venue, address, map links)
- `Step5Gallery` — Screen 5 form (photo upload, max 20)
- `Step6Wishes` — Screen 6 form (enable wishes, featured wishes)
- `Step7Rsvp` — Screen 7 form (RSVP mode, deadline, custom message)
- `InvitationPreview` — Live preview phone frame
- `InvitationRenderer` — Renders blocks (envelope, hero, etc.)
