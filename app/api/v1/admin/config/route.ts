import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { createAdminClient } from "@/lib/supabase/admin"
import type { CardLanguage } from "@/lib/config"
import type { Package, LabelTranslations } from "@/lib/invitationApi"

type UpdateBody = {
  cardLanguages?: CardLanguage[]
  packages?: Package[]
  labelTranslations?: LabelTranslations
}

/**
 * PUT /api/v1/admin/config — Update app config. Admin only.
 */
export async function PUT(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (!isAdmin(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  let body: UpdateBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const supabase = createAdminClient()
  const updates: { key: string; value: unknown }[] = []

  if (Array.isArray(body.cardLanguages) && body.cardLanguages.length > 0) {
    const valid = body.cardLanguages.every(
      (x) =>
        typeof x === "object" &&
        x &&
        typeof (x as CardLanguage).value === "string" &&
        typeof (x as CardLanguage).label === "string"
    )
    if (valid) {
      updates.push({ key: "card_languages", value: body.cardLanguages })
    }
  }

  if (Array.isArray(body.packages) && body.packages.length > 0) {
    const valid = body.packages.every(
      (x) =>
        typeof x === "object" &&
        x &&
        typeof (x as Package).value === "string" &&
        typeof (x as Package).label === "string"
    )
    if (valid) {
      updates.push({ key: "packages", value: body.packages })
    }
  }

  if (body.labelTranslations && typeof body.labelTranslations === "object") {
    updates.push({ key: "label_translations", value: body.labelTranslations })
  }

  if (updates.length === 0) {
    return NextResponse.json({ error: "No valid updates" }, { status: 400 })
  }

  for (const { key, value } of updates) {
    const { error } = await supabase
      .from("app_config")
      .upsert({ key, value }, { onConflict: "key" })
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  return NextResponse.json({ ok: true })
}
