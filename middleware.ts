// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublicPath = path === '/login' || path === '/register' || path === '/'
  
  const token = request.cookies.get('token')?.value || ''

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/members-dashboard', request.url))
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

// Add your protected routes
export const config = {
  matcher: [
    '/members-dashboard',
    '/members-dashboard/:path*',
    '/login',
    '/register'
  ]
}