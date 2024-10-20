"use server";

import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongoDBConnect";
import User from "@/models/user.model";

interface SignInWithCredentialParams {
  email: string;
  password: string;
}
interface GetUserByEmailParams {
  email: string;
}

export async function signInWithCredentials({
  email,
  password,
}: SignInWithCredentialParams) {
  connectDB();

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordIsValid = await bcrypt.compare(password, user.password);

  if (!passwordIsValid) {
    throw new Error("Invalid email or password");
  }

  return { ...user._doc, _id: user._id.toString() };
}

export async function getUserByEmail({ email }: GetUserByEmailParams) {
  connectDB();

  const user = await User.findOne({ email }).select("-password");

  if (!user) {
    throw new Error("User does not exist");
  }

  return { ...user._doc, _id: user._id.toString() };
}
