import jwt from 'jsonwebtoken';

const TOKEN_SECRET_KEY = process.env.JWT_SECRET!;
const AUTH_TOKEN_MAX_AGE = process.env.AUTH_TOKEN_MAX_AGE!;

export function generateAuthToken(tokenData: {
  userId: string;
  email: string;
}) {
  return jwt.sign(tokenData, TOKEN_SECRET_KEY, {
    expiresIn: AUTH_TOKEN_MAX_AGE,
    // TODO: add issuer
  });
}

export function decodeToken(token: string): any {
  return jwt.verify(token, TOKEN_SECRET_KEY);
}
