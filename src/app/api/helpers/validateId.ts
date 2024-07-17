import mongoose from 'mongoose';

export function validateId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}
