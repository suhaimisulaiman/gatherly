"use client"

import { useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

export function SocialSignIn({ mode, next }: { mode: "login" | "signup"; next?: string }) {
  const handleSocialSignIn = useCallback(async () => {
    const supabase = createClient()
    let path = "/auth/callback"
    if (next) path += `?next=${encodeURIComponent(next)}`
    const redirectTo = typeof window !== "undefined" ? `${window.location.origin}${path}` : path
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    })
  }, [next])

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={() => handleSocialSignIn()}
    >
      Continue with Google
    </Button>
  )
}
