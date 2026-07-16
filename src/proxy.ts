import { NextRequest, NextResponse } from 'next/server'
import { adminUrl, getAdminRoute, isCustomAdminRoute } from '@/utilities/adminRoute'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isCustomAdminRoute() && (pathname === '/admin' || pathname.startsWith('/admin/'))) {
    const url = request.nextUrl.clone()
    url.pathname = `${getAdminRoute()}${pathname.slice('/admin'.length)}`
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
