"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserMenu } from "@/components/auth/UserMenu"

/** Hide on studio routes - they have their own header */
export function SiteHeader() {
  const pathname = usePathname()
  if (pathname === "/studio" || pathname?.includes("/studio")) {
    return null
  }
  return (
    <header className="flex items-center justify-between border-b border-border px-4 py-2">
      <Link href="/" className="flex items-center gap-2">
        <div className="size-6 rounded-md bg-foreground" />
        <span className="text-sm font-semibold tracking-tight">Gatherly</span>
      </Link>
      <UserMenu />
    </header>
  )
}
