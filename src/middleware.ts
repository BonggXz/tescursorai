import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = token?.role === 'ADMIN'
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')

    // Protect admin routes
    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Add security headers
    const response = NextResponse.next()
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=()'
    )

    return response
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow public routes
        if (!req.nextUrl.pathname.startsWith('/admin')) {
          return true
        }
        // Require authentication for admin routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
