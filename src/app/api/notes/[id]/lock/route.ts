import { isLoggedIn } from '@/app/api/helpers/auth';
import { filterPublicNote } from '@/app/api/helpers/note';
import { validateId } from '@/app/api/helpers/validateId';
import { User } from '@/models/User';
import { encrypt } from '@/services/cipher';
import { lockNoteSchema } from '@/validation/validationSchemas';
import { validate } from '@/validation/validator';
import { NextRequest, NextResponse } from 'next/server';

// POST /notes/[id]/lock
// locks and encrypts note with given id
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

    // bad request if note is locked
    if (note.locked) {
      return NextResponse.json(
        { success: false, message: 'Note already locked' },
        { status: 400 }
      );
    }

    // get notePassword from user
    const reqBody = await request.json();
    const { notePassword, confirmNotePassword } = reqBody;

    // validate note password
    const {
      success: isNotePasswordValid,
      errorMessage: invalidNotePasswordMessage,
    } = validate(lockNoteSchema, { notePassword, confirmNotePassword });

    if (!isNotePasswordValid) {
      return NextResponse.json(
        { success: false, message: invalidNotePasswordMessage },
        { status: 400 }
      );
    }

    // encrypt note body
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

    note.body = encrypted; // set encrypted not body
    note.locked = true;
    note.iv = iv;
    await user.save();

    return NextResponse.json(
      { success: true, message: 'Note locked', note: filterPublicNote(note) },
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
