import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { noteSchema } from '@/models/Note';
import { sendMail } from '@/services/mailService';
import { Token, hasTokenExpired } from './Token';

const BCRYPT_WORK_FACTOR = 12;
const DUMMY_HASH =
  '$2b$12$tksIE.4VywlXZuoAhhvM2O0feB65oluLlv6fFsHP16ooXUNugOLDK';

export const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 128,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      maxlength: 254,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 1024,
    },
    notes: [noteSchema],
    verifiedAt: Date,
  },
  { timestamps: true }
);

// hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, BCRYPT_WORK_FACTOR);
  }
  next();
});

export function isVerified(user: any) {
  return !!user.verifiedAt;
}

export function comparePassword(
  plainTextPwd: string,
  hashedPwd: string = DUMMY_HASH
) {
  return bcrypt.compare(plainTextPwd, hashedPwd);
}

export async function sendConfirmationEmail(user: any) {
  const token = new Token({
    userId: user._id,
    expires: Date.now() + +process.env.EMAIL_VERIFICATION_TIMEOUT!,
  });
  await token.save();

  const url = process.env.APP_URL + `/users/email/verify?tokenId=${token._id}`;

  return sendMail({
    to: user.email,
    subject: 'Please confirm your email',
    text: `Please click on this link to verify your email: ${url}`,
  });
}

export async function sendPasswordResetEmail(user: any) {
  const token = new Token({
    userId: user._id,
    expires: Date.now() + +process.env.PASSWORD_RESET_TIMEOUT!,
  });
  await token.save();

  const url =
    process.env.APP_URL + `/users/password/reset?tokenId=${token._id}`;

  return sendMail({
    to: user.email,
    subject: 'Password reset',
    text: `Please click on this link to reset your password: ${url}`,
  });
}

export async function verifyToken(tokenId: string) {
  const token = await Token.findById(tokenId);

  if (!token) {
    return false;
  }
  if (hasTokenExpired(token)) {
    await token.deleteOne();
    return false;
  }

  return token;
}

export const User = mongoose.models.User || mongoose.model('User', userSchema);
