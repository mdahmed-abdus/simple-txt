import { isLoggedIn } from '@/app/api/helpers/auth';
import { validateId } from '@/app/api/helpers/validateId';
import { User } from '@/models/User';
import { encrypt } from '@/services/cipher';
import { NextRequest, NextResponse } from 'next/server';

// POST /notes/[id]/lock
// locks and encrypts note with given id
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

    if (note.locked) {
      return NextResponse.json(
        { success: false, message: 'Note already locked' },
        { status: 400 }
      );
    }

    const reqBody = await request.json();
    const { notePassword } = reqBody;

    const { success, message, encrypted, iv } = encrypt(
      note.body,
      notePassword
    );

    if (!success) {
      return NextResponse.json(
        { success: false, message: message },
        { status: 400 }
      );
    }

    note.body = encrypted;
    note.locked = true;
    note.iv = iv;
    await user.save();

    return NextResponse.json(
      { success: true, message: 'Note locked' },
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
