import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/auth';

const PROTECTED_PREFIXES = [
  '/all-students',
  '/fetch-detail',
  '/add-student',
  '/statements',
  '/all-staff',
  '/fetch-staff-detail',
  '/add-staff',
];

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const isAuth = await verifySessionToken(token);

  const isProtectedRoute = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isProtectedRoute && !isAuth) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === '/login' && isAuth) {
    return NextResponse.redirect(new URL('/all-students', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/all-students/:path*',
    '/fetch-detail/:path*',
    '/add-student/:path*',
    '/statements/:path*',
    '/all-staff/:path*',
    '/fetch-staff-detail/:path*',
    '/add-staff/:path*',
    '/login',
  ],
};