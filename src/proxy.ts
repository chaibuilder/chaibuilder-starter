import { NextRequest, NextResponse } from 'next/server'
import { adminUrl, getAdminRoute, isCustomAdminRoute } from '@/utilities/adminRoute'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isCustomAdminRoute() && (pathname === '/admin' || pathname.startsWith('/admin/'))) {
    const url = request.nextUrl.clone()
    url.pathname = `${getAdminRoute()}${pathname.slice('/admin'.length)}`
    return NextResponse.redirect(url)
  }

  if (request.nextUrl.searchParams.has('r')) {
    const url = new URL(request.nextUrl.href)
    url.searchParams.delete('r')
    return NextResponse.redirect(
      `${url.origin}${adminUrl('api', 'revalidate')}?redirect=true&paths=${url.pathname}`,
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
