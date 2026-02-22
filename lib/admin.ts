import type { User } from "@supabase/supabase-js"

/**
 * Check if the user is an admin. Uses ADMIN_EMAILS env (comma-separated).
 */
export function isAdmin(user: User | null): boolean {
  if (!user?.email) return false
  const allowed = process.env.ADMIN_EMAILS
  if (!allowed) return false
  const emails = allowed.split(",").map((e) => e.trim().toLowerCase())
  return emails.includes(user.email.toLowerCase())
}
