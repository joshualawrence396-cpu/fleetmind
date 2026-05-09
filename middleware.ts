import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "./lib/auth"

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value

  const protectedRoutes = ["/dashboard"]

  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  )

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/auth/login", req.url))
  }

  if (token) {
    const verified = verifyToken(token)

    if (!verified) {
      return NextResponse.redirect(new URL("/auth/login", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
