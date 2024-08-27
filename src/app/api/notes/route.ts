import { User } from '@/models/User';
import { connectDb } from '@/services/db';
import { NextRequest, NextResponse } from 'next/server';
import { isLoggedIn } from '../helpers/auth';
import { Note } from '@/models/Note';
import { validate } from '@/validation/validator';
import { noteSchema } from '@/validation/validationSchemas';

connectDb();

// GET /api/notes
// get all notes
export async function GET(request: NextRequest) {
  try {
    const userId = isLoggedIn(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { notes } = await User.findById(userId);

    return NextResponse.json(
      { success: true, message: `Found ${notes.length} note(s)`, notes },
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

// POST /api/notes
// add new note
export async function POST(request: NextRequest) {
  try {
    const userId = isLoggedIn(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const reqBody = await request.json();
    const { title, body, locked, notePassword, confirmNotePassword } = reqBody;

    const { success, errorMessage } = validate(noteSchema, {
      title,
      body,
      locked,
      notePassword,
      confirmNotePassword,
    });

    if (!success) {
      return NextResponse.json({ message: errorMessage }, { status: 400 });
    }

    const user = await User.findById(userId);
    const note = new Note({ title, body });

    user.notes.push(note);
    await user.save();

    return NextResponse.json(
      { success: true, message: 'Note created', note },
      { status: 201 }
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
