import { createClient } from "@supabase/supabase-js"

/**
 * Supabase client with service role. Server-only. Bypasses RLS.
 * Use only for admin operations after verifying user is admin.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY for admin operations")
  }
  return createClient(url, key)
}
