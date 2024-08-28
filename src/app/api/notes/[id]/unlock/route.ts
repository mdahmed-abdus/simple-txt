import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/models/User';
import { isLoggedIn } from '@/app/api/helpers/auth';
import { validateId } from '@/app/api/helpers/validateId';
import { decrypt } from '@/services/cipher';
import { filterPublicNote } from '@/app/api/helpers/note';
import { validate } from '@/validation/validator';
import { unlockNoteSchema } from '@/validation/validationSchemas';

// GET /api/notes/[id]/unlock
// unlocks and decrypts note with given id
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

    // bad request if note is unlocked
    if (!note.locked) {
      return NextResponse.json(
        { success: false, message: 'Note already unlocked' },
        { status: 400 }
      );
    }

    // get notePassword from user
    const reqBody = await request.json();
    const { notePassword } = reqBody;

    // validate note password
    const {
      success: isNotePasswordValid,
      errorMessage: invalidNotePasswordMessage,
    } = validate(unlockNoteSchema, { notePassword });

    if (!isNotePasswordValid) {
      return NextResponse.json(
        { success: false, message: invalidNotePasswordMessage },
        { status: 400 }
      );
    }

    // decrypt note body
    const { success, decrypted } = decrypt(note.body, notePassword, note.iv);

    if (!success) {
      // unsuccessful decryption -> invalid password
      return NextResponse.json(
        { success: false, message: 'Invalid note password' },
        { status: 400 }
      );
    }

    note.body = decrypted; // set decrypted not body
    note.locked = false;
    note.iv = null; // iv is null for unlocked notes
    await user.save();

    return NextResponse.json(
      { success: true, message: 'Note unlocked', note: filterPublicNote(note) },
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
