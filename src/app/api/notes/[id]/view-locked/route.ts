import { isLoggedIn } from '@/app/api/helpers/auth';
import { validateId } from '@/app/api/helpers/validateId';
import { User } from '@/models/User';
import { decrypt } from '@/services/cipher';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/notes/[id]/view-locked
// view locked note by id
export async function GET(
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
        { success: false, message: 'Note with given id was not found' },
        { status: 404 }
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
        { success: false, message: 'Invalid note password' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Note temporarily decrypted',
        note: { _id: note._id, decryptedBody: decrypted },
      },
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
