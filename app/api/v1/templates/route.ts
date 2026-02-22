import { NextResponse } from "next/server"
import { getTemplates } from "@/lib/templatesDb"

/**
 * GET /api/v1/templates — List active templates (public).
 */
export async function GET() {
  try {
    const templates = await getTemplates()
    return NextResponse.json(templates)
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to load templates" },
      { status: 500 }
    )
  }
}
