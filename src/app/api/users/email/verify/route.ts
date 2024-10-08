import { isLoggedIn } from '@/app/api/helpers/auth';
import { validateId } from '@/app/api/helpers/validateId';
import { User, isVerified, verifyToken } from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/users/email/verify
// verifies user
export async function POST(request: NextRequest) {
  try {
    // prevent access to authorized users
    if (await isLoggedIn(request)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    const searchParams = request.nextUrl.searchParams;
    const tokenId = searchParams.get('tokenId');

    if (!tokenId) {
      return NextResponse.json(
        { message: 'Token not provided' },
        { status: 400 }
      );
    }

    if (!validateId(tokenId)) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 400 });
    }

    const token = await verifyToken(tokenId);

    if (!token) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 400 });
    }

    const user = await User.findById(token.userId);
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

    user.verifiedAt = new Date();
    await user.save();
    await token.deleteOne();

    return NextResponse.json(
      { success: true, message: 'Email verified' },
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
