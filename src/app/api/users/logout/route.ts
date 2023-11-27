import { connectDb } from '@/services/db';
import { NextRequest, NextResponse } from 'next/server';
import { isLoggedIn } from '../../helpers/auth';

connectDb();

export async function POST(request: NextRequest) {
  try {
    // prevent access to unauthorized users
    if (!isLoggedIn(request)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      { success: true, message: 'User logged out' },
      { status: 200 }
    );
    response.cookies.set(process.env.AUTH_COOKIE_NAME!, '', {
      httpOnly: true,
      expires: new Date(0),
    });
    return response;
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
