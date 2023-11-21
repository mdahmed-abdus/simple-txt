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
    const { name, email, password } = reqBody;

    if (await User.exists({ email })) {
      return NextResponse.json(
        { message: 'User already registered' },
        { status: 400 }
      );
    }

    const user = new User({ name, email, password });
    await user.save();

    // TODO: send confirmation email

    return NextResponse.json(
      {
        success: true,
        message: 'User registered',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
