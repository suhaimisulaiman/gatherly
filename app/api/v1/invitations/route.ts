import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth"
import { invitationContentSchema } from "@/lib/schemas/invitationContent"

/**
 * GET /api/v1/invitations — List invitations for the current user.
 * Query: ?status=draft|published (optional, defaults to all)
 */
export async function GET(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")

  const supabase = await createClient()
  let query = supabase
    .from("invitations")
    .select("id, template_id, content, status, slug, created_at, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })

  if (status === "draft" || status === "published") {
    query = query.eq("status", status)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data ?? [])
}

/**
 * POST /api/v1/invitations — Create or update a draft invitation.
 * Body: { id?: string, template_id: string, content: object }
 * If id provided and user owns it → update. Else → create.
 */
export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: { id?: string; template_id?: string; content?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = invitationContentSchema.safeParse(body?.content ?? body)
  const content = (parsed.success ? parsed.data : {}) as Record<string, unknown>
  const template_id = body?.template_id && typeof body.template_id === "string" ? body.template_id : "elegant-rose"
  const id = body?.id && typeof body.id === "string" ? body.id : undefined

  const supabase = await createClient()

  if (id) {
    const { data: existing, error: fetchError } = await supabase
      .from("invitations")
      .select("id, user_id, status")
      .eq("id", id)
      .single()

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 })
    }
    if (existing.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    if (existing.status === "published") {
      return NextResponse.json({ error: "Cannot edit published invitation" }, { status: 400 })
    }

    const { data: updated, error: updateError } = await supabase
      .from("invitations")
      .update({ template_id, content: content as object })
      .eq("id", id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }
    return NextResponse.json(updated)
  }

  const { data: created, error: insertError } = await supabase
    .from("invitations")
    .insert({
      user_id: user.id,
      template_id,
      content: content as object,
      status: "draft",
    })
    .select()
    .single()

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }
  return NextResponse.json(created)
}
