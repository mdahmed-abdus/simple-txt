import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI!;

export async function connectDb() {
  try {
    await mongoose.connect(MONGO_URI);
  } catch (err) {
    console.log('Could not connect to MongoDB');
    console.log(err);
    process.exit(1);
  }
}
