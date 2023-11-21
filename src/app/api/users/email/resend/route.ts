import { isLoggedIn } from '@/app/api/helpers/auth';
import { User, isVerified, sendConfirmationEmail } from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

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
    const user = await User.findOne({ email: reqBody.email });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or already verified' },
        { status: 400 }
      );
    }
    if (isVerified(user)) {
      return NextResponse.json(
        { message: 'Invalid email or already verified' },
        { status: 400 }
      );
    }

    await sendConfirmationEmail(user);

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
