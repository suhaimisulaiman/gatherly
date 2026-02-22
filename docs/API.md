# Gatherly — Invitation APIs (v1)

Requires authentication. All routes return JSON.

Base path: `/api/v1`

## Save draft (create or update)

**POST** `/api/v1/invitations`

| Header | Value |
|--------|-------|
| Cookie | Supabase session (set automatically when logged in) |

**Body:**
```json
{
  "id": "uuid (optional – omit for new, include for update)",
  "template_id": "elegant-rose",
  "content": { /* InvitationContent shape */ }
}
```

**Response:** `200` — Full invitation object (includes `id` for new drafts).

**Errors:** `401` Unauthorized, `403` Forbidden, `404` Not found, `500` Server error.

---

## Load invitation

**GET** `/api/v1/invitations/[id]`

Returns invitation by `id`. User must own it (or it must be `published` for public access).

**Response:** `200` — Invitation object with `id`, `template_id`, `content`, `status`, `slug`, etc.

**Errors:** `403` Forbidden, `404` Not found.

---

## Publish invitation

**POST** `/api/v1/invitations/[id]/publish`

Sets `status` to `published` and generates a unique `slug` (or keeps existing).

**Response:** `200` — Updated invitation (includes `slug` for shareable link `/i/[slug]`).

**Errors:** `401` Unauthorized, `403` Forbidden, `404` Not found, `409` Slug conflict, `500` Server error.

---

## Content shape

`content` follows `InvitationContent` in `lib/schemas/invitationContent.ts` (eventType, invitationTitle, hostNames, eventDate, venueName, eventAgenda, galleryPhotos, wishes, RSVP settings, etc.).
