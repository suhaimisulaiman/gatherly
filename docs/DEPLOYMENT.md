# Gatherly — Vercel + Supabase Deployment

## Overview

- **Hosting:** Vercel (Next.js)
- **Database & Auth:** Supabase (PostgreSQL + Auth)

## 1. Supabase setup

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. Run the database migration: **SQL Editor** → paste and run `supabase/migrations/00001_initial_schema.sql`. See [DATABASE.md](./DATABASE.md) for details.
3. In **Project Settings → API** copy:
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
3. **Environment Variables** (Project → Settings → Environment Variables) — add:
   - **App / auth:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **Migrate before deploy:** `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF`, `SUPABASE_DB_PASSWORD` (so the build runs migrations first, then `next build`)
4. Deploy. Each deploy runs **migrate → build → deploy** (migrations run in the prebuild step).

## 4. Supabase client usage

| Context | Import | Usage |
|--------|--------|--------|
| Client Components (`"use client"`) | `import { createClient } from "@/lib/supabase/client"` | `const supabase = createClient()` |
| Server Components / Server Actions / Route Handlers | `import { createClient } from "@/lib/supabase/server"` | `const supabase = await createClient()` |

- **Auth:** Use `supabase.auth.getUser()`, `signInWithOAuth`, `signOut`, etc. See [Supabase Auth docs](https://supabase.com/docs/guides/auth).
- **Database:** Use `supabase.from("table").select()`, `.insert()`, etc. Define tables in Supabase SQL Editor or migrations.

## 5. Proxy (session refresh)

The root `proxy.ts` runs on each request (excluding static assets) and refreshes Supabase auth cookies via `lib/supabase/proxy.ts`. This keeps the session in sync; do not remove it if you use Supabase Auth.

## 6. Auth (login / signup)

- **App routes:** `/login`, `/signup`, `/forgot-password`. OAuth callback: `/auth/callback`.
- **Supabase:** In **Authentication** → **URL Configuration**, set **Site URL** and add **Redirect URLs** (e.g. `https://yourdomain.com/auth/callback`, `http://localhost:3000/auth/callback`).
- **Social providers:** Enable and configure Google, Facebook, Apple in **Authentication** → **Providers**. See [AUTH.md](./AUTH.md) for step-by-step setup.

## 7. Next steps

- Protect member/studio routes with `getCurrentUser()` and redirect to `/login` when not signed in (see [AUTH.md](./AUTH.md)).
- Wire invitation APIs (save/load draft, publish) and public `/i/[slug]`.
- Add env vars for Stripe, Resend, storage (S3/R2) when you integrate them.
