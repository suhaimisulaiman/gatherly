# Gatherly — Database (Supabase)

## Schema overview

| Table        | Purpose |
|-------------|---------|
| `invitations` | One per event; `user_id` (owner), `template_id`, `content` (JSON), `status` (draft/published/archived), `slug` (for `/i/[slug]`). |
| `guests`      | Guest-list mode: named invitees per invitation; `invitation_id`, `name`, `slug` (per-guest link). |
| `rsvps`       | Guest responses; `invitation_id`, `guest_slug` (or null for open mode), `response` (pending/attending/declined), `extra_guests`. |
| `wishes`      | Guest messages on invitation; `invitation_id`, `name`, `message`. |

Row Level Security (RLS) is enabled: owners manage their invitations/guests/rsvps/wishes; public can read published invitations and submit RSVPs/wishes.

## Run migrations

### Option A: Supabase Dashboard (recommended for first run)

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project.
2. Go to **SQL Editor**.
3. Copy the contents of `supabase/migrations/00001_initial_schema.sql`.
4. Paste and click **Run**.

### Option B: Supabase CLI (local)

```bash
# Install Supabase CLI: npm i -g supabase
supabase login
supabase link --project-ref zvrzbihzwcrhzfkaqsmu   # or your project ref
supabase db push
```

### Option C: Automatic (migrate before deploy, Vercel build)

Migrations run **before** every Vercel build (prebuild step), so deploy order is always: **migrate → build → deploy**.

1. In **Vercel** (Project → Settings → Environment Variables), add:
   - **SUPABASE_ACCESS_TOKEN** — [Supabase Dashboard → Access Tokens](https://supabase.com/dashboard/account/tokens) (generate new token).
   - **SUPABASE_PROJECT_REF** — Project ref (e.g. `zvrzbihzwcrhzfkaqsmu`).
   - **SUPABASE_DB_PASSWORD** — Database password (Project Settings → Database).

2. Push to `main`. Vercel runs `npm run build` → **prebuild** (migrate) runs first, then `next build`.

Only migration files that haven’t been applied yet run; the CLI tracks applied versions in the database. Locally, `npm run build` skips migrate if these env vars are not set.

### Option D: Manual (GitHub Action)

**Actions → Supabase migrations (manual) → Run workflow** — run migrations without deploying (uses repo secrets: `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF`, `SUPABASE_DB_PASSWORD`).

## After migration

- Tables and RLS policies will be in place.
- Use `user_id = auth.uid()` in app code for the current Supabase Auth user (after you add Auth in Phase 1).
- `content` in `invitations` stores the same shape as `InvitationContent` in `lib/schemas/invitationContent.ts`.
