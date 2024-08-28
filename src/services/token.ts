import { SignJWT, jwtVerify } from 'jose';

const SECRET = process.env.JWT_SECRET!;
const EXP = +process.env.AUTH_TOKEN_MAX_AGE!;

export async function signAuthToken(payload: {
  userId: string;
  email: string;
}): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime(iat + EXP)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new TextEncoder().encode(SECRET));
}

export async function verifyAuthToken(token: string) {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(SECRET)
    );
    return payload;
  } catch (err) {
    return false;
  }
}
