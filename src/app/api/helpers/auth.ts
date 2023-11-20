import { decodeToken } from '@/services/token';
import { NextRequest } from 'next/server';

export function isLoggedIn(request: NextRequest) {
  const token = request.cookies.get(process.env.AUTH_COOKIE_NAME!)?.value;

  if (!token) {
    return false;
  }

  const { userId } = decodeToken(token);

  return userId ? userId : false;
}
