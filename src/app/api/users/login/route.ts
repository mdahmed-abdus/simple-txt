import { User, comparePassword, isVerified } from '@/models/User';
import { connectDb } from '@/services/db';
import { NextRequest, NextResponse } from 'next/server';
import { generateAuthToken } from '@/services/token';
import { isLoggedIn } from '../../helpers/auth';

connectDb();

export async function POST(request: NextRequest) {
  try {
    // prevent access to authorized users
    if (isLoggedIn(request)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

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

    const token = generateAuthToken({ userId: user._id, email: user.email });
    response.cookies.set(process.env.AUTH_COOKIE_NAME!, token, {
      httpOnly: true,
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
