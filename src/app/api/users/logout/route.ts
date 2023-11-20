import { connectDb } from '@/services/db';
import { NextRequest, NextResponse } from 'next/server';

connectDb();

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json(
      { success: true, message: 'User logged out' },
      { status: 200 }
    );
    response.cookies.set('token', '', { httpOnly: true, expires: new Date(0) });
    return response;
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
