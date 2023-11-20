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
      maxlength: 1_000,
    },
  },
  { timestamps: true }
);

export const Note = mongoose.models.Note || mongoose.model('Note', noteSchema);
