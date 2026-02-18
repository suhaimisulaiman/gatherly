import { toHijri } from "hijri-converter"

const HIJRI_MONTH_NAMES = [
  "Muharram",
  "Safar",
  "Rabiʻ I",
  "Rabiʻ II",
  "Jumada I",
  "Jumada II",
  "Rajab",
  "Shaʻban",
  "Ramadan",
  "Shawwal",
  "Dhu al-Qiʻdah",
  "Dhu al-Hijjah",
]

/** Convert a Gregorian date string (YYYY-MM-DD) to formatted Hijri string */
export function formatHijriDate(dateStr: string): string | null {
  if (!dateStr?.trim()) return null
  try {
    const d = new Date(dateStr)
    if (Number.isNaN(d.getTime())) return null
    const { hy, hm, hd } = toHijri(d.getFullYear(), d.getMonth() + 1, d.getDate())
    const monthName = HIJRI_MONTH_NAMES[hm - 1] ?? `Month ${hm}`
    return `${hd} ${monthName} ${hy}`
  } catch {
    return null
  }
}
