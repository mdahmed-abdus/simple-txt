import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { noteSchema } from '@/models/Note';

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

export const User = mongoose.models.User || mongoose.model('User', userSchema);
