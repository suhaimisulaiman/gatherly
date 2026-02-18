"use client"

import { useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

const providers = [
  { id: "google" as const, label: "Google", icon: "G" },
  { id: "facebook" as const, label: "Facebook", icon: "f" },
  { id: "apple" as const, label: "Apple", icon: "" },
]

type ProviderId = "google" | "facebook" | "apple"

export function SocialSignIn({ mode }: { mode: "login" | "signup" }) {

  const handleSocialSignIn = useCallback(async (provider: ProviderId) => {
    const supabase = createClient()
    const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : "/auth/callback"
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    })
  }, [])

  return (
    <div className="grid gap-2">
      {providers.map((p) => (
        <Button
          key={p.id}
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => handleSocialSignIn(p.id)}
        >
          {p.label}
        </Button>
      ))}
    </div>
  )
}
