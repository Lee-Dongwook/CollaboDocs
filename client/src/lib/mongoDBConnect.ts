import mongoose from "mongoose";

const connection: { isConnected?: number } = {};

const connectDB = async () => {
  if (connection.isConnected) {
    return;
  }

  if (!process.env.MONGODB_URI) {
    console.log("Error: Invalid MONGODB URI");
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI!);
    connection.isConnected = db.connections[0].readyState;

    if (connection.isConnected === 1) {
      console.log("Successfully connected to MongoDB");
    } else {
      console.log("Failed to connect to MongoDB");
    }
  } catch (error) {
    console.log("Failed to connect to MongoDB", (error as Error).message);
  }
};

export default connectDB;
