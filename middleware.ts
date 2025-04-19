import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If the user is not signed in and the current path is not / or /login or /signup
  // redirect the user to /
  if (
    !session &&
    !req.nextUrl.pathname.startsWith("/login") &&
    !req.nextUrl.pathname.startsWith("/signup") &&
    !req.nextUrl.pathname.startsWith("/auth/callback") &&
    req.nextUrl.pathname !== "/"
  ) {
    const redirectUrl = new URL("/login", req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If the user is signed in and the current path is / or /login or /signup
  // redirect the user to /dashboard
  if (
    session &&
    (req.nextUrl.pathname === "/" ||
      req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/signup"))
  ) {
    const redirectUrl = new URL("/dashboard", req.url)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
