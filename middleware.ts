import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if the user is trying to access the dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // Get the verification status from cookies
    const isVerified = request.cookies.get('securityVerified')?.value

    // If not verified, redirect to security page
    if (!isVerified) {
      return NextResponse.redirect(new URL('/security', request.url))
    }
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: '/dashboard/:path*'
}
