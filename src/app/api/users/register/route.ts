import { User, sendConfirmationEmail } from '@/models/User';
import { connectDb } from '@/services/db';
import { NextRequest, NextResponse } from 'next/server';
import { isLoggedIn } from '../../helpers/auth';
import { validate } from '@/validation/validator';
import { userRegisterSchema } from '@/validation/validationSchemas';

connectDb();

// POST /api/users/register
// register new user
export async function POST(request: NextRequest) {
  try {
    // prevent access to authorized users
    if (await isLoggedIn(request)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const reqBody = await request.json();
    const { name, email, password, confirmPassword } = reqBody;

    const { success, errorMessage } = validate(userRegisterSchema, {
      name,
      email,
      password,
      confirmPassword,
    });

    if (!success) {
      return NextResponse.json({ message: errorMessage }, { status: 400 });
    }

    if (await User.exists({ email })) {
      return NextResponse.json(
        { message: 'User already registered' },
        { status: 400 }
      );
    }

    const user = new User({ name, email, password });
    await user.save();

    await sendConfirmationEmail(user);

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
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
