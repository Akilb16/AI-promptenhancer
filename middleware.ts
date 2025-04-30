import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Check if we're in a preview environment
const isPreview = process.env.VERCEL_ENV === "preview" || process.env.NODE_ENV === "development"

export async function middleware(req: NextRequest) {
  // In preview mode, allow all access
  if (isPreview) {
    return NextResponse.next()
  }

  // For production, we'll handle auth in the components
  // This is a simplified middleware that just prevents direct access to dashboard routes
  // without going through the auth flow
  const path = req.nextUrl.pathname

  // Protected routes that require authentication
  const isProtectedRoute = path.startsWith("/dashboard")

  // Check for a session cookie - this is a simple check, not a full auth verification
  const hasCookie = req.cookies.has("sb-auth-token") || req.cookies.has("supabase-auth-token")

  // If trying to access protected route without a cookie, redirect to login
  if (isProtectedRoute && !hasCookie) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
