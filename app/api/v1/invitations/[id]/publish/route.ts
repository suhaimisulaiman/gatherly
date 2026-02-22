import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth"
import { generateSlug } from "@/lib/slug"

type Params = { params: Promise<{ id: string }> }

/**
 * POST /api/v1/invitations/[id]/publish — Publish invitation (generate slug, set status=published).
 */
export async function POST(_request: Request, { params }: Params) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const supabase = await createClient()

  const { data: existing, error: fetchError } = await supabase
    .from("invitations")
    .select("id, user_id, status, slug")
    .eq("id", id)
    .single()

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Invitation not found" }, { status: 404 })
  }
  if (existing.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  if (existing.status === "published") {
    return NextResponse.json({ ...existing, message: "Already published" })
  }

  const slug = existing.slug ?? generateSlug()

  const { data: updated, error: updateError } = await supabase
    .from("invitations")
    .update({ status: "published", slug })
    .eq("id", id)
    .select()
    .single()

  if (updateError) {
    if (updateError.code === "23505") {
      return NextResponse.json({ error: "Slug conflict, please retry" }, { status: 409 })
    }
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json(updated)
}
