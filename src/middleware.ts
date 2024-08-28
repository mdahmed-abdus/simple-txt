import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuthToken } from './services/token';

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME!;

export async function middleware(request: NextRequest) {
  const authCookie = request ? request.cookies.get(AUTH_COOKIE_NAME) : null;

  const path = request.nextUrl.pathname;

  const isPublicPath = [
    '/login',
    '/register',
    '/users/email/verify',
    '/users/password/reset',
  ].includes(path);

  if (authCookie) {
    const authCookieValid = await verifyAuthToken(authCookie.value);

    if (!authCookieValid) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete(AUTH_COOKIE_NAME);

      return response;
    }
  }

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
