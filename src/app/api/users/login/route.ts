import { User, comparePassword, isVerified } from '@/models/User';
import { connectDb } from '@/services/db';
import { NextRequest, NextResponse } from 'next/server';

connectDb();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    const user = await User.findOne({ email });

    const validPassword = await comparePassword(password, user?.password);

    if (!user || !validPassword) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 400 }
      );
    }

    if (!isVerified(user)) {
      return NextResponse.json(
        { message: 'Email not verified' },
        { status: 403 }
      );
    }

    const response = NextResponse.json(
      {
        success: true,
        message: 'User logged in',
        user: { name: user.name, email: user.email, notes: user.notes },
      },
      { status: 200 }
    );

    // TODO: implement jwt
    response.cookies.set(process.env.AUTH_COOKIE_NAME!, 'jwt-token-here', {
      httpOnly: true,
    });

    return response;
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
