import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authCookie = request
    ? request.cookies.get(process.env.AUTH_COOKIE_NAME!)
    : null;
  const path = request.nextUrl.pathname;

  const isPublicPath = [
    '/login',
    '/register',
    '/users/email/verify',
    '/users/password/reset',
  ].includes(path);

  // for authenticated users
  if (authCookie && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // for !authenticated users
  if (!authCookie && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/dashboard',
    '/profile',
    '/notes/:path*',
    '/login',
    '/register',
    '/users/email/verify',
    '/users/password/reset',
  ],
};
