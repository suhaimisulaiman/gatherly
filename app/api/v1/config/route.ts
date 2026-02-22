import { NextResponse } from "next/server"
import { getCardLanguages, getPackages, getLabelTranslations } from "@/lib/config"

/**
 * GET /api/v1/config — Public app config (card languages, packages, label translations, etc.).
 */
export async function GET() {
  const [cardLanguages, packages, labelTranslations] = await Promise.all([
    getCardLanguages(),
    getPackages(),
    getLabelTranslations(),
  ])
  return NextResponse.json({
    cardLanguages,
    packages,
    labelTranslations,
  })
}
