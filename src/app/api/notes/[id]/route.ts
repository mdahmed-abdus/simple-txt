import { User } from '@/models/User';
import { connectDb } from '@/services/db';
import { NextRequest, NextResponse } from 'next/server';
import { isLoggedIn } from '../../helpers/auth';
import { noteSchema } from '@/validation/validationSchemas';
import { validate } from '@/validation/validator';
import { validateId } from '../../helpers/validateId';

connectDb();

// GET /api/notes/[id]
// get note by id
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
    const note = user.notes.find(
      (n: any, i: number) => n._id.toString() === params.id
    );

    if (!note) {
      return NextResponse.json(
        { success: false, message: 'Note with given id was not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Note found', note },
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
    const note = user.notes.find(
      (n: any, i: number) => n._id.toString() === params.id
    );

    if (!note) {
      return NextResponse.json(
        { success: false, message: 'Note with given id was not found' },
        { status: 404 }
      );
    }

    const reqBody = await request.json();

    // if updated title not provided then use the old title
    // if updated body not provided then use the old body
    const { title = note.title, body = note.body } = reqBody;

    const { success, errorMessage } = validate(noteSchema, {
      title,
      body,
    });

    if (!success) {
      return NextResponse.json({ message: errorMessage }, { status: 400 });
    }

    note.title = title;
    note.body = body;
    await user.save();

    return NextResponse.json(
      { success: true, message: 'Note updated', note },
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
    const note = user.notes.find(
      (n: any, i: number) => n._id.toString() === params.id
    );

    if (!note) {
      return NextResponse.json(
        { success: false, message: 'Note with given id was not found' },
        { status: 404 }
      );
    }

    await note.deleteOne();
    await user.save();

    return NextResponse.json(
      { success: true, message: 'Note deleted', note },
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
