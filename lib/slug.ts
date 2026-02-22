/**
 * Generate a unique URL-safe slug for published invitations.
 */
export function generateSlug(): string {
  const random = crypto.getRandomValues(new Uint8Array(6))
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  let s = "inv-"
  for (let i = 0; i < random.length; i++) {
    s += chars[random[i]! % chars.length]
  }
  return s + Date.now().toString(36)
}
