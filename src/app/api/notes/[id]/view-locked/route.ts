import { isLoggedIn } from '@/app/api/helpers/auth';
import { validateId } from '@/app/api/helpers/validateId';
import { User } from '@/models/User';
import { decrypt } from '@/services/cipher';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/notes/[id]/view-locked
// view locked note by id
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // check if user is logged in
    // accessible only for authenticated users
    const userId = await isLoggedIn(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // validate id
    if (!validateId(params.id)) {
      return NextResponse.json(
        { message: 'Note with given id was not found' },
        { status: 400 }
      );
    }

    // get user and note
    const user = await User.findById(userId);
    const note = user.notes.find((n: any) => n._id.toString() === params.id);

    if (!note) {
      return NextResponse.json(
        { success: false, message: 'Note with given id was not found' },
        { status: 404 }
      );
    }

    // not found if note is unlocked
    if (!note.locked) {
      return NextResponse.json(
        { success: false, message: 'Note with given id was not found' },
        { status: 404 }
      );
    }

    // get notePassword from user
    const reqBody = await request.json();
    const { notePassword } = reqBody;

    // decrypt note
    const { success, decrypted } = decrypt(note.body, notePassword, note.iv);
    if (!success) {
      // unsuccessful decryption -> invalid password
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
