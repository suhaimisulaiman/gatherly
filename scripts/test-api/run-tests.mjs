#!/usr/bin/env node
/**
 * Test invitation APIs. Signs in with TEST_EMAIL + TEST_PASSWORD, then runs create → load → publish.
 * Requires: TEST_EMAIL, TEST_PASSWORD in env (or .env.local)
 * Run: node scripts/test-api/run-tests.mjs
 */

import { createClient } from "@supabase/supabase-js"

const BASE_URL = process.env.BASE_URL || "http://localhost:3000"
const email = process.env.TEST_EMAIL
const password = process.env.TEST_PASSWORD
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function loadEnv() {
  try {
    const fs = await import("fs")
    const path = await import("path")
    const envPath = path.join(process.cwd(), ".env.local")
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf8")
      for (const line of content.split("\n")) {
        const m = line.match(/^([^#=]+)=(.*)$/)
        if (m) {
          const key = m[1].trim()
          const val = m[2].trim().replace(/^["']|["']$/g, "")
          if (!process.env[key]) process.env[key] = val
        }
      }
    }
  } catch {}
}

/**
 * Build session cookie in the same format @supabase/ssr uses.
 * - Single chunk: sb-{ref}-auth-token = raw JSON
 * - Multiple chunks: sb-{ref}-auth-token.0, .1, ... (3180 chars per chunk, split on encodeURIComponent)
 */
function getCookieFromSession(session) {
  if (!session) return null
  const projectRef = supabaseUrl?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1]
  if (!projectRef) return null
  const key = `sb-${projectRef}-auth-token`
  const value = JSON.stringify({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: session.expires_at,
    expires_in: session.expires_in,
    token_type: session.token_type,
    user: session.user,
  })
  const MAX_CHUNK = 3180 // matches @supabase/ssr chunker
  const encoded = encodeURIComponent(value)
  if (encoded.length <= MAX_CHUNK) {
    return `${key}=${encodeURIComponent(value)}`
  }
  const chunks = []
  let rest = encoded
  while (rest.length > 0) {
    let head = rest.slice(0, MAX_CHUNK)
    const lastEscape = head.lastIndexOf("%")
    if (lastEscape > MAX_CHUNK - 3) {
      head = head.slice(0, lastEscape)
    }
    while (head.length > 0) {
      try {
        decodeURIComponent(head)
        break
      } catch {
        head = head.slice(0, -3)
      }
    }
    chunks.push(decodeURIComponent(head))
    rest = rest.slice(head.length)
  }
  return chunks
    .map((chunk, i) => `${key}.${i}=${encodeURIComponent(chunk)}`)
    .join("; ")
}

async function main() {
  await loadEnv()

  if (!email || !password) {
    console.error("Set TEST_EMAIL and TEST_PASSWORD (or add to .env.local)")
    process.exit(1)
  }
  if (!supabaseUrl || !supabaseKey) {
    console.error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY required")
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseKey)
  const { data: auth, error: authError } = await supabase.auth.signInWithPassword({ email, password })
  if (authError || !auth.session) {
    console.error("Sign in failed:", authError?.message || "No session")
    process.exit(1)
  }
  const cookie = getCookieFromSession(auth.session)
  if (!cookie) {
    console.error("Could not build auth cookie")
    process.exit(1)
  }
  console.log("Signed in as", auth.user.email)

  const headers = {
    "Content-Type": "application/json",
    Cookie: cookie,
  }

  const sampleContent = {
    eventType: "Wedding Ceremony",
    invitationTitle: "Ahmad & Siti",
    hostNames: "Ahmad & Siti",
    eventDate: "2026-03-15",
    shortGreeting: "We joyfully invite you",
    venueName: "Grand Ballroom",
    address: "123 Main St, KL",
  }

  let id

  try {
    console.log("\n1. POST /api/v1/invitations (create draft)...")
    const createRes = await fetch(`${BASE_URL}/api/v1/invitations`, {
      method: "POST",
      headers,
      body: JSON.stringify({ template_id: "elegant-rose", content: sampleContent }),
    })
    const createData = await createRes.json()
    if (!createRes.ok) {
      throw new Error(`Create failed: ${createRes.status} ${JSON.stringify(createData)}`)
    }
    id = createData.id
    console.log("   OK — id:", id)

    console.log("\n2. GET /api/v1/invitations/[id] (load)...")
    const loadRes = await fetch(`${BASE_URL}/api/v1/invitations/${id}`, { headers })
    const loadData = await loadRes.json()
    if (!loadRes.ok) {
      throw new Error(`Load failed: ${loadRes.status} ${JSON.stringify(loadData)}`)
    }
    console.log("   OK — status:", loadData.status, "| title:", loadData.content?.invitationTitle)

    console.log("\n3. POST /api/v1/invitations/[id]/publish...")
    const publishRes = await fetch(`${BASE_URL}/api/v1/invitations/${id}/publish`, {
      method: "POST",
      headers,
    })
    const publishData = await publishRes.json()
    if (!publishRes.ok) {
      throw new Error(`Publish failed: ${publishRes.status} ${JSON.stringify(publishData)}`)
    }
    console.log("   OK — slug:", publishData.slug, "| status:", publishData.status)

    console.log("\n✅ All tests passed.")
    console.log("   Share URL: /i/" + publishData.slug)
  } catch (e) {
    console.error("\n❌", e.message)
    process.exit(1)
  }
}

main()
