import mongoose from 'mongoose';

export const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      minlength: 3,
      maxlength: 60,
    },
    body: {
      type: String,
      trim: true,
      required: true,
      minlength: 3,
    },
    locked: {
      type: Boolean,
      required: true,
      default: false,
    },
    iv: {
      type: Buffer,
    },
  },
  { timestamps: true }
);

export const Note = mongoose.models.Note || mongoose.model('Note', noteSchema);
