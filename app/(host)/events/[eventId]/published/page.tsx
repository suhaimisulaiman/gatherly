"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { CheckCircle2, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PublishedPage() {
  const searchParams = useSearchParams()
  const slug = searchParams.get("slug")
  const [fullUrl, setFullUrl] = useState<string>("")

  useEffect(() => {
    if (slug && typeof window !== "undefined") {
      setFullUrl(`${window.location.origin}/i/${slug}`)
    }
  }, [slug])

  const displayUrl = fullUrl || (slug ? `/i/${slug}` : "")

  function handleCopy() {
    if (!displayUrl || !navigator.clipboard) return
    navigator.clipboard.writeText(fullUrl || displayUrl)
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <CheckCircle2 className="size-16 text-emerald-500" />
        <h1 className="text-2xl font-semibold tracking-tight">Your invitation is published</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Share the link below with your guests. They can view your invitation, RSVP, and leave wishes.
        </p>
      </div>
      {slug && (
        <div className="flex w-full max-w-md flex-col gap-2">
          <div className="rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm font-mono text-foreground break-all">
            {displayUrl}
          </div>
          <div className="flex gap-2">
            <Button asChild size="sm">
              <a href={`/i/${slug}`} target="_blank" rel="noopener noreferrer">
                View invitation
              </a>
            </Button>
            <Button onClick={handleCopy} variant="outline" className="gap-2" size="sm">
              <Share2 className="size-4" />
              Copy link
            </Button>
          </div>
        </div>
      )}
      <Link href="/dashboard">
        <Button variant="outline" size="sm">Back to Dashboard</Button>
      </Link>
    </div>
  )
}
