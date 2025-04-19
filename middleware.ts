import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Get the pathname from the URL
  const path = req.nextUrl.pathname

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/signup", "/auth/callback"]
  const isPublicRoute = publicRoutes.some((route) => path === route || path.startsWith(route))

  // Protected routes that require authentication
  const isProtectedRoute = path.startsWith("/dashboard")

  // If user is not signed in and trying to access a protected route
  if (!session && isProtectedRoute) {
    const redirectUrl = new URL("/login", req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is signed in and trying to access login/signup
  if (session && (path === "/login" || path === "/signup" || path === "/")) {
    const redirectUrl = new URL("/dashboard", req.url)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
