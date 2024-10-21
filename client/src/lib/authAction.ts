"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongoDBConnect";
import { nextAuthOptions } from "@/lib/nextAuthOptions";
import User from "@/models/user.model";

interface SignUpWithCredentialsParams {
  name: string;
  email: string;
  password: string;
}

interface SignInWithCredentialParams {
  email: string;
  password: string;
}
interface GetUserByEmailParams {
  email: string;
}

export async function getUserSession() {
  const session = await getServerSession(nextAuthOptions);
  return { session };
}

export async function signUpWithCredentials({
  name,
  email,
  password,
}: SignUpWithCredentialsParams) {
  connectDB();

  try {
    const user = await User.findOne({ email });

    if (user) {
      throw new Error("User already exists.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return { success: true };
  } catch (error) {
    redirect(`/error?error=${(error as Error).message}`);
  }
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
