# Gatherly — Product Requirements Document

## Executive Summary

Gatherly is a digital invitation platform that enables users to create, manage, and share event invitations. The application spans a public landing site, authenticated member area, invitation builder (already partially built), guest management, invitation management, and an admin panel.

---

## 1. Product Requirements Document (PRD)

### 1.1 Vision & Goals

- **Vision:** Become the go-to platform for beautiful, shareable digital invitations in the target market (Malaysia/SEA focus with multi-language support).
- **Goals:** Acquire users, drive conversions to paid plans, retain hosts with repeat events, and scale through partnerships and ads.

### 1.2 Target Users

| Persona | Description | Primary Needs |
|---------|-------------|---------------|
| **Host** | Individual planning an event (wedding, birthday, reunion, corporate) | Easy creation, professional designs, guest management, RSVP tracking |
| **Guest** | Recipient of invitation | Simple RSVP, save to calendar, view on mobile |
| **Admin** | Platform operator | User/order management, content moderation, revenue & analytics |

### 1.3 Core Modules & Features

---

#### Module 1: Landing Page / Marketing Website

| Feature | Priority | Description |
|---------|----------|-------------|
| Hero section | P0 | Value proposition, primary CTA, sample invitation preview |
| Feature highlights | P0 | Key benefits (designs, RSVP, calendar, multi-language) |
| Template showcase | P0 | Featured templates by event type |
| Pricing section | P0 | Plan comparison, clear CTAs |
| Testimonials / Social proof | P1 | User reviews, ratings, sample events |
| FAQ | P1 | Common questions (pricing, delivery, support) |
| Blog / Content | P2 | Event tips, trends, SEO content |
| Footer | P0 | Links (About, Terms, Privacy, Contact), social links |

---

#### Module 2: Member Area (Auth & Profile)

| Feature | Priority | Description |
|---------|----------|-------------|
| Social login | P0 | Google, Facebook, Apple Sign In |
| Email/password signup & login | P0 | Fallback auth |
| Profile management | P0 | Name, email, avatar |
| Member dashboard | P0 | Overview: invitations, guests, usage |
| Payment history | P0 | View past purchases, receipts |
| Password reset | P0 | Email-based reset flow |
| Email verification | P1 | Verify email on signup |

---

#### Module 3: Invitation Builder (Wizard)

| Feature | Priority | Description |
|---------|----------|-------------|
| Choose design | P0 | Browse templates, filters (event type, style), preview |
| Event details | P0 | Title, greeting, event type, date |
| Event agenda | P0 | Time slots, add/remove items |
| Venue | P0 | Name, address, Maps/Waze links |
| Photo gallery | P0 | Upload photos (max 20), reorder, captions |
| Wishes | P0 | Enable/disable, featured wishes, guest posting |
| RSVP settings | P0 | Mode, deadline, message, max guests, extras |
| Review & publish | P0 | Final preview, publish / save as draft |
| Live preview | P0 | Phone-frame preview, scroll to section |
| Add-ons | P1 | Background music, opening style, animated effects |
| Multi-language | P1 | Bahasa, English, Arabic |
| Save draft | P0 | Auto-save, restore later |
| Duplicate invitation | P1 | Clone for similar events |

---

#### Module 4: Guest Management

| Feature | Priority | Description |
|---------|----------|-------------|
| Guest list | P0 | Add/edit/remove guests, import CSV |
| Groups / tags | P1 | e.g. "Family", "Colleagues" |
| Bulk actions | P1 | Send reminders, mark status |
| Per-invitee links | P0 | Unique URL per guest (guest-list mode) |
| RSVP tracking | P0 | Status (pending, attending, declined), extra guests |
| Attendance dashboard | P1 | Charts, counts, export |
| Reminder emails | P1 | Optional reminder before event |

---

#### Module 5: Invitation Management

| Feature | Priority | Description |
|---------|----------|-------------|
| My invitations | P0 | List with status (draft, published, past) |
| Search & filter | P1 | By event type, date, status |
| Edit invitation | P0 | Return to studio, update content |
| Share options | P0 | Copy link, WhatsApp, QR code |
| Unpublish / archive | P1 | Hide from public, keep data |
| Analytics | P1 | Views, RSVPs, wishes by invitation |
| Duplicate | P1 | Clone invitation |

---

#### Module 6: Admin Panel

| Feature | Priority | Description |
|---------|----------|-------------|
| Dashboard | P0 | Users, orders, invitations, revenue KPIs |
| User management | P0 | List, search, block, view activity |
| Order / payment management | P0 | Per-invite orders, payments, refunds |
| **Package management** | P0 | Create/edit packages, set price, name, description |
| **Configurable features per package** | P0 | Toggle on/off per feature per package (e.g. gallery, RSVP, wishes) |
| Graphics assets | P0 | Upload templates, fonts, default images |
| Default settings | P1 | Default audio, labels, UI copy |
| **Sponsored ads** | P0 | Create ad campaigns, manage sponsors, set placements & targeting |
| Content moderation | P1 | Flagged invitations, wishes |
| System settings | P1 | Feature flags, maintenance mode |
| Audit logs | P1 | Admin actions for compliance |

---

### 1.4 Technical Architecture (High Level)

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (Next.js)                          │
│  Landing │ Member Area │ Invitation Builder │ Guest Management    │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                      API (Next.js API / BFF)                     │
│  Auth │ Invitations │ Guests │ RSVP │ Wishes │ Orders │ Admin   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│  Database (Postgres) │ Storage (S3/R2) │ Payments (Stripe)       │
└─────────────────────────────────────────────────────────────────┘
```

---

### 1.5 Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| Performance | Invitation load &lt; 2s, studio autosave &lt; 1s |
| Security | HTTPS, secure auth, input validation, rate limiting |
| Availability | 99.5% uptime target |
| Scalability | Support 10k concurrent users |
| Mobile | Responsive, mobile-first for guest experience |
| Compliance | GDPR/ PDPA-ready, terms of use, privacy policy |

---

## 2. Monetization Plan

### 2.1 Revenue Streams

| Stream | Model | Description |
|--------|-------|-------------|
| **Per-invite charge** | One-time | Pay per invitation/event — primary revenue |
| **Premium templates** | One-time | Higher price for exclusive designs |
| **Add-ons** | à la carte | Extra photos, premium music, custom options per invite |
| **Sponsored ads** | B2B | Vendors pay to display ads (venues, caterers, photographers) |

### 2.2 Configurable Packages

Packages are created and managed in the admin panel. Each package has:
- Name, description, price (MYR)
- Feature toggles — admin enables/disables which features the package includes

**Example feature catalog (toggleable per package):**

| Feature | Description |
|---------|-------------|
| Shareable link | Publish and share invitation |
| Gallery | Photo upload (limit configurable) |
| Wishes | Guest wishes section |
| RSVP | RSVP with optional extras |
| Add to calendar | Save-to-calendar button |
| Premium templates | Access to premium template set |
| No watermark | Remove branding |
| **No sponsored ads** | Hide sponsored ads on invitation (e.g. Premium = on, Basic = off) |
| **Special Link (Guest List)** | Per-guest unique links, personalized greeting, named RSVP tracking |
| Custom domain | Use own domain (future) |

**Sample packages (admin-configurable):**

| Package | Price | Key differentiator |
|---------|-------|--------------------|
| Free preview | 0 | Create & preview only (no share, watermark) |
| **Basic** | RM29 | **Open invitation** — one shared link, generic greeting |
| **Premium** | RM49 | **Special Link (Guest List)** — per-guest links, personalized greeting, named RSVP + no ads |

*Special Link (Guest List) is the primary separator between Basic and Premium: Basic = Open only, Premium = Special Link available.*

**Admin UI for packages:**
- List packages (name, price, active)
- Create / edit package: form with name, price, description
- Feature matrix: each package row, each feature column — toggle on/off
- Add/remove packages; reorder for display on landing/checkout

### 2.3 Sponsored Ads

Vendors (venues, caterers, photographers, florists, etc.) can pay to display sponsored ads to invitation viewers. Admin manages campaigns and placements.

**Admin capabilities:**
- **Sponsor management:** Create sponsors (name, logo, link, contact)
- **Ad campaigns:** Create campaigns per sponsor — image/banner, CTA, landing URL
- **Placements:** Configure where ads appear (e.g. end of invitation, between sections, sidebar)
- **Targeting:** By event type (wedding, birthday), region, package tier
- **Scheduling:** Start/end dates, daily budget or flat fee
- **Reporting:** Impressions, clicks per campaign

**Ad placements (configurable):**
- End of invitation (after RSVP)
- Between sections (e.g. after Venue, before Gallery)
- Footer / "Recommended for you" block

**Package control:** Sponsored ads are controlled via the package feature toggle "No sponsored ads". When this feature is **on** for a package (e.g. Premium), no ads are shown on invitations using that package. When **off** (e.g. Basic), ads are shown. Admin configures this per package.

**Pricing model (admin-configurable):**
- CPM (cost per 1000 impressions)
- CPC (cost per click)
- Flat monthly/sponsorship fee

### 2.4 Conversion Strategy (Packages)

- Free create & preview to demonstrate value before payment
- Pay once at publish — no recurring charges
- Discount for multiple invites in one order (e.g. 3 for 2)
- Referral credit (e.g. RM5 off next invite for referrer)

---

## 3. Development Plan

### 3.1 Phases Overview

| Phase | Duration | Focus |
|-------|----------|-------|
| Phase 1 | 8–10 weeks | Foundation, auth, core studio |
| Phase 2 | 6–8 weeks | Guest management, invitation management |
| Phase 3 | 4–6 weeks | Landing, pricing, payments |
| Phase 4 | 6–8 weeks | Admin panel, operations |
| Phase 5 | Ongoing | Iteration, analytics, growth |

---

### 3.2 Phase 1: Foundation & Core Studio (8–10 weeks)

#### 1. Project setup (Weeks 1–2)
- [ ] Database (Postgres) — schema, migrations
- [ ] Auth provider (NextAuth.js / Auth.js)
- [ ] API routes structure (Next.js)
- [ ] Storage for images (S3/R2 or similar)
- [ ] Environment config (dev, prod)

#### 2. Auth (Weeks 2–3)
- [ ] Social login (Google, Facebook, Apple)
- [ ] Email/password signup & login
- [ ] Session handling, protected routes
- [ ] Password reset flow
- [ ] Logout

#### 3. Member area (Weeks 3–4)
- [ ] Member dashboard (skeleton) — redirect after login
- [ ] Profile page — view/edit name, email, avatar
- [ ] Auth middleware — redirect unauthenticated users

#### 4. Data model (Weeks 4–5)
- [ ] Users table (id, email, name, avatar, provider)
- [ ] Invitations table (id, user_id, template_id, content JSON, status, slug, created_at)
- [ ] Guests table (id, invitation_id, name, slug, …) — for future guest-list mode
- [ ] RSVPs table (id, invitation_id, guest_slug, response, extra_guests)
- [ ] Wishes table (id, invitation_id, name, message)
- [ ] Migrations & seed data

#### 5. Invitation Builder — backend integration (Weeks 4–6)
- [ ] Save draft API (upsert invitation, status=draft)
- [ ] Load draft API (by invitation_id + user_id)
- [ ] Publish API (status=published, generate slug)
- [ ] Replace localStorage draft with API persistence
- [ ] Auth gate — require login to create/save invitations

#### 6. Invitation public view (Weeks 6–7)
- [ ] Public route `/i/[slug]` — view invitation (no auth)
- [ ] Render invitation from DB (content, template)
- [ ] Shareable link generation
- [ ] RSVP API — save guest RSVP to DB
- [ ] Wishes API — save guest wish to DB
- [ ] Load RSVPs & wishes for display

#### 7. Polish & deploy (Weeks 8–10)
- [ ] Error handling, loading states
- [ ] Basic tests (auth, publish, RSVP)
- [ ] Deployment (Vercel + DB)
- [ ] Monitoring, error tracking

**Key outcomes:** Users sign up, create invitations end-to-end (from wizard to DB), and share links. Guests view invitations and RSVP/post wishes; data persists in DB.

---

### 3.3 Phase 2: Guest & Invitation Management (6–8 weeks)

| Week | Deliverables |
|------|--------------|
| 1–2 | Guest list CRUD, CSV import |
| 2–3 | Per-guest invite links (guest-list mode) |
| 3–4 | RSVP dashboard (status, counts) |
| 4–5 | Invitation list (my invitations), search/filter |
| 5–6 | Edit/duplicate invitation, share options (WhatsApp, QR) |
| 6–8 | Analytics (views, RSVPs), reminder emails (optional) |

**Key outcomes:** Hosts can manage guests, track RSVPs, and manage multiple invitations.

---

### 3.4 Phase 3: Landing, Pricing & Payments (4–6 weeks)

| Week | Deliverables |
|------|--------------|
| 1–2 | Landing page (hero, features, templates, pricing) |
| 2–3 | Stripe integration: one-time checkout, webhooks |
| 3–4 | Payment flow: pay at publish, receipt, order history |
| 4–5 | Feature gating (preview free, full features after payment) |
| 5–6 | Promo codes, bulk discounts (e.g. 3 invites) |

**Key outcomes:** Public site live, users pay per invitation at publish.

---

### 3.5 Phase 4: Admin Panel (6–8 weeks)

| Week | Deliverables |
|------|--------------|
| 1–2 | Admin auth, dashboard, layout |
| 2–3 | User management (list, search, block) |
| 3–4 | Order/payment management |
| 4–5 | Package management (create, edit, feature toggles) |
| 5–6 | Template/asset management |
| 6–7 | Default settings (audio, labels) |
| 7–8 | Sponsored ads (sponsors, campaigns, placements, targeting), audit logs, moderation |

**Key outcomes:** Internal team can operate and monetize the platform.

---

### 3.6 Phase 5: Iteration & Growth (Ongoing)

- A/B tests (landing, pricing, upgrade prompts)
- Analytics (funnels, retention, LTV)
- Localization (more languages)
- Integrations (e.g. WhatsApp Business, calendar sync)
- Mobile app (React Native / PWA) if needed

---

### 3.7 Tech Stack Recommendation

| Layer | Technology |
|-------|------------|
| Frontend | Next.js (App Router), React, Tailwind |
| Auth | NextAuth.js / Auth.js (Google, Facebook, Apple) |
| Database | PostgreSQL (Supabase / Neon / Vercel Postgres) |
| Storage | S3 / R2 (images, templates) |
| Payments | Stripe |
| Hosting | Vercel |
| Email | Resend / SendGrid |
| Admin UI | Admin dashboard (custom or Retool/Tooljet for MVP) |

---

## 4. Success Metrics

| Metric | Target (Year 1) |
|--------|-----------------|
| Registered users | 10,000+ |
| Preview-to-paid conversion | 10–15% |
| Revenue | Scale with invitations sold |
| Invitation completion rate | &gt; 60% |
| NPS | &gt; 40 |
| Invitation load time | &lt; 2s p95 |

---

## 5. Appendix

### A. Invitation Types: Open vs Special Link

| Aspect | **Open Invitation** | **Special Link (Guest List) Invitation** |
|--------|---------------------|------------------------------------------|
| **Link** | One shared link for all guests | Unique link per guest |
| **Access** | Anyone with the link can view & RSVP | Link tied to a named guest (e.g. `/invite/abc123/guest/jane-doe`) |
| **Personalization** | Same content for everyone; "Dear Guest" or generic greeting | Greeting can use guest name (e.g. "Dear Jane") |
| **RSVP tracking** | Anonymous; host sees counts only | Host sees who (by name) has responded |
| **Use case** | Casual events, open RSVP, large groups | Weddings, formal events, seated dinners |
| **Setup** | Host publishes, shares one link | Host creates guest list, system generates per-guest links |

**Package control:** "Special Link (Guest List)" is the main differentiator — Basic = Open only, Premium = Special Link enabled. This creates a clear upgrade reason for formal events (weddings, seated dinners) where hosts need named tracking and personalized invites.

### B. Glossary

- **Host:** User who creates and owns an invitation.
- **Guest:** Recipient who receives and can RSVP to an invitation.
- **Invitation:** Single event card with content, RSVP, wishes, etc.

### C. Open Questions

- Target launch date?
- Initial market (Malaysia-only vs SEA)?
- Preferred payment gateway (Stripe vs local)?
- Template ownership (in-house vs licensed)?

---

*Document version: 1.0 | Last updated: Feb 2026*
