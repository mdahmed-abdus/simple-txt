import { verifyAuthToken } from '@/services/token';
import { NextRequest } from 'next/server';

export async function isLoggedIn(request: NextRequest) {
  const token = request.cookies.get(process.env.AUTH_COOKIE_NAME!)?.value;

  if (!token) {
    return false;
  }

  const payload = await verifyAuthToken(token);

  return payload ? payload.userId : false;
}
