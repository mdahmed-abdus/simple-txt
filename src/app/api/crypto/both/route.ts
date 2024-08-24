import { encrypt, decrypt } from '@/services/cipher';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/notes
// add new note
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { data } = reqBody;

    const enc = encrypt(data);
    const dec = decrypt(enc);

    return NextResponse.json({ success: true, enc, dec }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
