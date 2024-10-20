import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

export default async function dbConnect() {
  try {
    const { connection } = await mongoose.connect(MONGODB_URI as string, {
      serverSelectionTimeoutMS: 20000,
    });
    if (connection.readyState === 1) {
      return Promise.resolve(true);
    }
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}
