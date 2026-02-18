# Gatherly — Vercel + Supabase Deployment

## Overview

- **Hosting:** Vercel (Next.js)
- **Database & Auth:** Supabase (PostgreSQL + Auth)

## 1. Supabase setup

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. In **Project Settings → API** copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Publishable key** (or **anon** key) → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. (Optional) For server-only admin tasks, copy **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (never expose to client).

## 2. Local environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

Run the app:

```bash
npm run dev
```

## 3. Vercel deployment

1. Push the repo to GitHub (or connect another Git provider).
2. In [vercel.com](https://vercel.com): **Add New Project** → import the repo.
3. **Environment Variables** (Project → Settings → Environment Variables) — add the same Supabase vars:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. Deploy. Vercel will detect Next.js and build/deploy automatically.

## 4. Supabase client usage

| Context | Import | Usage |
|--------|--------|--------|
| Client Components (`"use client"`) | `import { createClient } from "@/lib/supabase/client"` | `const supabase = createClient()` |
| Server Components / Server Actions / Route Handlers | `import { createClient } from "@/lib/supabase/server"` | `const supabase = await createClient()` |

- **Auth:** Use `supabase.auth.getUser()`, `signInWithOAuth`, `signOut`, etc. See [Supabase Auth docs](https://supabase.com/docs/guides/auth).
- **Database:** Use `supabase.from("table").select()`, `.insert()`, etc. Define tables in Supabase SQL Editor or migrations.

## 5. Proxy (session refresh)

The root `proxy.ts` runs on each request (excluding static assets) and refreshes Supabase auth cookies via `lib/supabase/proxy.ts`. This keeps the session in sync; do not remove it if you use Supabase Auth.

## 6. Next steps

- Add Auth.js/NextAuth or Supabase Auth UI for login/signup (PRD: social + email/password).
- Create Supabase tables (users, invitations, guests, RSVPs, etc.) and wire APIs.
- Add env vars for Stripe, Resend, storage (S3/R2) when you integrate them.
