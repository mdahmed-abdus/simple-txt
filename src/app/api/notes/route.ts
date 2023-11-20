import { User } from '@/models/User';
import { connectDb } from '@/services/db';
import { decodeToken } from '@/services/token';
import { NextRequest, NextResponse } from 'next/server';

connectDb();

export async function GET(request: NextRequest) {
  try {
    const token =
      request.cookies.get(process.env.AUTH_COOKIE_NAME!)?.value || '';

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { userId } = decodeToken(token);

    const { notes } = await User.findById(userId);

    return NextResponse.json(
      { success: true, message: `Found ${notes.length} note(s)`, notes },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
