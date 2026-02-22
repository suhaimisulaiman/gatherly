# API Test Scripts

Test the invitation APIs (`/api/v1/invitations`).

## Prerequisites

1. Dev server running: `npm run dev`
2. Logged in as a user (email or Google)
3. Session cookie to pass to the scripts

## Getting the session cookie

1. Open http://localhost:3000 and sign in
2. Open DevTools (F12) → Application → Cookies → `http://localhost:3000`
3. Find the cookie named `sb-<project-ref>-auth-token` (or `sb-<project-ref>-auth-token.0`, `.1` if chunked)
4. Copy the full cookie string, e.g. `sb-xxx-auth-token=eyJ...`

## Option A: Node script (recommended)

Uses Supabase to sign in and automatically obtains the session cookie:

```bash
# Set test credentials (must be a real user)
export TEST_EMAIL=your@email.com
export TEST_PASSWORD=yourpassword

# Run tests (loads .env.local for Supabase URL/key)
node scripts/test-api/run-tests.mjs
```

## Option B: cURL (manual cookie)

```bash
# Set the cookie (from browser DevTools)
export COOKIE="sb-zvrzbihzwcrhzfkaqsmu-auth-token=YOUR_COOKIE_VALUE"

# Base URL (default: http://localhost:3000)
export BASE_URL="${BASE_URL:-http://localhost:3000}"

# Run the curl script
./scripts/test-api/curl-test.sh
```

## Tests run

1. **Create draft** — POST /api/v1/invitations with sample content
2. **Load draft** — GET /api/v1/invitations/[id]
3. **Publish** — POST /api/v1/invitations/[id]/publish
