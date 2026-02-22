import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth"

type Params = { params: Promise<{ id: string }> }

/**
 * GET /api/v1/invitations/[id] — Load invitation by id (user must own it, or public if published).
 */
export async function GET(_request: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const user = await getCurrentUser()

  const { data, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: "Invitation not found" }, { status: 404 })
  }

  if (data.status !== "published" && (!user || data.user_id !== user.id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return NextResponse.json(data)
}
