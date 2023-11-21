import mongoose from 'mongoose';

export const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  expires: {
    type: Date,
    required: true,
  },
});

export function hasTokenExpired(token: any) {
  return Date.now() > token.expires;
}

export const Token =
  mongoose.models.Token || mongoose.model('Token', tokenSchema);
