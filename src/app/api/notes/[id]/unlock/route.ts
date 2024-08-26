import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/models/User';
import { isLoggedIn } from '@/app/api/helpers/auth';
import { validateId } from '@/app/api/helpers/validateId';
import { decrypt } from '@/services/cipher';

// GET /api/notes/[id]/unlock
// unlocks and decrypts note with given id
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = isLoggedIn(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!validateId(params.id)) {
      return NextResponse.json(
        { message: 'Note with given id was not found' },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    const note = user.notes.find((n: any) => n._id.toString() === params.id);

    if (!note) {
      return NextResponse.json(
        { success: false, message: 'Note with given id was not found' },
        { status: 404 }
      );
    }

    if (!note.locked) {
      return NextResponse.json(
        { success: false, message: 'Note already unlocked' },
        { status: 400 }
      );
    }

    const reqBody = await request.json();
    const { notePassword } = reqBody;

    const { success, message, decrypted } = decrypt(
      note.body,
      notePassword,
      note.iv
    );

    if (!success) {
      return NextResponse.json(
        { success: false, message: message },
        { status: 400 }
      );
    }

    note.body = decrypted;
    note.locked = false;
    note.iv = null;
    await user.save();

    return NextResponse.json(
      { success: true, message: 'Note unlocked' },
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
