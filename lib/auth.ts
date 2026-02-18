import { createClient } from "@/lib/supabase/server"

/**
 * Get the current authenticated user (server only).
 * Returns null if not signed in.
 */
export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user ?? null
}
