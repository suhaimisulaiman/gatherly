# Testing

Gatherly uses [Vitest](https://vitest.dev) for unit and integration tests.

## Commands

```bash
npm run test          # Run all tests once
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## Structure

### Unit tests

Located alongside source files with `.test.ts` or `.test.tsx`:

| File | Coverage |
|------|----------|
| `lib/slug.test.ts` | `generateSlug()` — format, uniqueness |
| `lib/hijri.test.ts` | `formatHijriDate()` — valid/invalid dates |
| `lib/generateIcs.test.ts` | `generateIcs()` — VCALENDAR output, escaping, time handling |
| `lib/schemas/invitationContent.test.ts` | `invitationContentSchema` — validation, defaults |
| `lib/guestRsvp.test.ts` | `loadGuestRsvp`, `saveGuestRsvp` — localStorage (mocked) |
| `lib/guestWishes.test.ts` | `loadGuestWishes`, `saveGuestWish` — localStorage (mocked) |
| `lib/utils.test.ts` | `cn()` — class name merging |

### Integration tests (API routes)

API route handlers are tested with mocked Supabase and auth:

| File | Coverage |
|------|----------|
| `app/api/v1/invitations/route.test.ts` | POST create/update, auth, 401/403/404/400 |
| `app/api/v1/invitations/[id]/route.test.ts` | GET 404, 403 for draft, public for published |
| `app/api/v1/invitations/[id]/publish/route.test.ts` | POST publish, 401/403/404/409 |

## Configuration

- **Vitest config**: `vitest.config.ts`
- **Setup file**: `vitest.setup.ts` (loads `@testing-library/jest-dom`)
- **Environment**: `jsdom` for DOM APIs (localStorage, etc.)

## Adding tests

1. Create a `*.test.ts` file next to the module.
2. Use `vi.mock()` for Supabase, auth, or other external deps.
3. Use `vi.stubGlobal()` for `localStorage` / `window` when needed.
