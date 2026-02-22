import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

type Params = { params: Promise<{ slug: string }> }

/**
 * GET /api/v1/invitations/slug/[slug] — Load published invitation by slug (public, no auth).
 */
export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params
  if (!slug?.trim()) {
    return NextResponse.json({ error: "Slug required" }, { status: 400 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("slug", slug.trim())
    .eq("status", "published")
    .single()

  if (error || !data) {
    return NextResponse.json({ error: "Invitation not found" }, { status: 404 })
  }

  return NextResponse.json(data)
}
