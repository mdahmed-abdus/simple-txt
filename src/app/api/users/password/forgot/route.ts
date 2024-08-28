import { isLoggedIn } from '@/app/api/helpers/auth';
import { User, isVerified, sendPasswordResetEmail } from '@/models/User';
import { passwordResetSchema } from '@/validation/validationSchemas';
import { validate } from '@/validation/validator';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/users/password/forgot
// sends password reset email
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
    const { email } = reqBody;

    const { success, errorMessage } = validate(passwordResetSchema, { email });

    if (!success) {
      return NextResponse.json({ message: errorMessage }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or email not verified' },
        { status: 400 }
      );
    }
    if (!isVerified(user)) {
      return NextResponse.json(
        { message: 'Invalid email or email not verified' },
        { status: 400 }
      );
    }

    await sendPasswordResetEmail(user);

    return NextResponse.json(
      { success: true, message: 'Email sent' },
      { status: 200 }
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
