import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get("refresh_token_restaurant")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  return NextResponse.next()
}

// Qaysi routelar uchun middleware ishlashini ko'rsatish:
export const config = {
  matcher: ["/", "/dashboard/:path*"],
}
