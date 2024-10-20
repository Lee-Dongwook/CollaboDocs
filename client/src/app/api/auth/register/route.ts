import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { hash } from "bcryptjs";

if (!process.env.MONGODB_URI) throw new Error("env error");
const uri: string = process.env.MONGODB_URI;

async function handler(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { result: false, error: "Method not allowed" },
      { status: 405 }
    );
  }

  const { email, password, username } = await req.json();

  if (!email || !password || !username) {
    return NextResponse.json(
      { result: false, error: "모든 필드를 입력해야 해요!" },
      { status: 400 }
    );
  }

  const client = await MongoClient.connect(uri);
  const db = client.db();

  try {
    const existingUser = await db.collection("users").findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { result: false, error: "이미 가입된 계정이예요!" },
        { status: 422 }
      );
    }

    const hashedPassword = await hash(password, 12);
    const status = await db.collection("users").insertOne({
      email,
      password: hashedPassword,
      username,
    });

    return NextResponse.json(
      { result: true, message: "User created", ...status },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Route not valid" }, { status: 500 });
  } finally {
    client.close();
  }
}
export { handler as POST };
