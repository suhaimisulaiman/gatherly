import type { NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/proxy"

/**
 * Proxy runs before routes. We use it to refresh Supabase auth cookies
 * so the session stays in sync (avoids random logouts).
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static, _next/image (static/assets)
     * - favicon and common static file extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
