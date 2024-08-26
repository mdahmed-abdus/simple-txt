import { encrypt, decrypt } from '@/services/cipher';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/notes
// add new note
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { data, password } = reqBody;

    const {
      success: encSuccess,
      message: encMessage,
      encrypted: enc,
      iv,
    } = encrypt(data, password);
    if (!encSuccess) {
      return NextResponse.json(
        { success: false, message: encMessage },
        { status: 400 }
      );
    }

    const {
      success: decSuccess,
      message: decMessage,
      decrypted: dec,
    } = decrypt(enc!, password, iv!);
    if (!decSuccess) {
      return NextResponse.json(
        { success: false, message: decMessage },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, enc, dec }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
