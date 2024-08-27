import { User } from '@/models/User';
import { connectDb } from '@/services/db';
import { NextRequest, NextResponse } from 'next/server';
import { isLoggedIn } from '../../helpers/auth';
import {
  notePasswordSchema,
  updateNoteSchema,
} from '@/validation/validationSchemas';
import { validate } from '@/validation/validator';
import { validateId } from '../../helpers/validateId';
import { filterPublicNote } from '../../helpers/note';
import { decrypt, encrypt } from '@/services/cipher';

connectDb();

// GET /api/notes/[id]
// get note by id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // check if user is logged in
    // accessible only for authenticated users
    const userId = isLoggedIn(request);
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

    // get user note
    const user = await User.findById(userId);
    const note = user.notes.find((n: any) => n._id.toString() === params.id);

    if (!note) {
      return NextResponse.json(
        { success: false, message: 'Note with given id was not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Note found', note: filterPublicNote(note) },
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

// PUT /api/notes/[id]
// update note by id
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // check if user is logged in
    // accessible only for authenticated users
    const userId = isLoggedIn(request);
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

    // note data from user
    const reqBody = await request.json();

    // if updated title not provided then use the old title
    let { title = note.title, body, notePassword } = reqBody;

    // validate note password
    const {
      success: isNotePasswordValid,
      errorMessage: invalidNotePasswordMessage,
    } = validate(notePasswordSchema, {
      notePassword,
    });
    if (!isNotePasswordValid) {
      return NextResponse.json(
        { success: false, message: invalidNotePasswordMessage },
        { status: 400 }
      );
    }

    let noteBodyUpdated = true;

    // if updated body not provided then use the old body
    // if note is locked we need to decrypt the old note body before using it
    if (note.locked) {
      // correct password -> decryption successful -> proceed with note update
      // invalid password -> decryption not successful -> cancel note update
      const { success: decryptSuccessful, decrypted } = decrypt(
        note.body,
        notePassword,
        note.iv
      );

      if (!decryptSuccessful) {
        return NextResponse.json(
          { success: false, message: 'Invalid note password' },
          { status: 400 }
        );
      }

      if (!body) {
        noteBodyUpdated = false;
        body = decrypted; // use old decrypted note body
      }
    } else {
      // note unlocked -> we can use old note body directly
      if (!body) {
        noteBodyUpdated = false;
        body = note.body; // use old note body
      }
    }

    // validate note title and body
    const { success: isNoteDataValid, errorMessage: invalidNoteDataMessage } =
      validate(updateNoteSchema, {
        title,
        body,
      });
    if (!isNoteDataValid) {
      return NextResponse.json(
        { success: false, message: invalidNoteDataMessage },
        { status: 400 }
      );
    }

    // updating note
    if (noteBodyUpdated) {
      // note body needs to be updated only if updated body is provided
      if (note.locked) {
        // noteBodyUpdated && note.locked -> update note body -> encrypt again = yes
        const { success, message, encrypted, iv } = encrypt(body, notePassword);
        if (!success) {
          return NextResponse.json(
            { success: false, message: message },
            { status: 400 }
          );
        }
        note.body = encrypted; // update note body
        note.iv = iv; // update note iv
      } else {
        // noteBodyUpdated && !note.locked -> update note body -> encrypt again = no
        note.body = body;
      }
    }
    // no changes to note body if updated body is not provided
    // !noteBodyUpdated && note.locked -> no action -> encrypt again = no
    // !noteBodyUpdated && !note.locked -> no action -> encrypt again = no

    note.title = title; // update note title
    await user.save();

    return NextResponse.json(
      { success: true, message: 'Note updated', note: filterPublicNote(note) },
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

// DELETE /api/notes/[id]
// delete note by id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // check if user is logged in
    // accessible only for authenticated users
    const userId = isLoggedIn(request);
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

    // get notePassword from user
    const reqBody = await request.json();
    const { notePassword } = reqBody;

    // validate note password
    const { success, errorMessage } = validate(notePasswordSchema, {
      notePassword,
    });
    if (!success) {
      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: 400 }
      );
    }

    await note.deleteOne();
    await user.save();

    return NextResponse.json(
      { success: true, message: 'Note deleted', note: filterPublicNote(note) },
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
