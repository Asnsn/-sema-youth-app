import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Simplified middleware without Supabase SSR
  return
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
