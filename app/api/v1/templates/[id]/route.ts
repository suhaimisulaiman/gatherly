import { NextResponse } from "next/server"
import { getTemplateById } from "@/lib/templatesDb"

/**
 * GET /api/v1/templates/[id] — Single template by id (public).
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const template = await getTemplateById(id)
  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 })
  }
  return NextResponse.json(template)
}
