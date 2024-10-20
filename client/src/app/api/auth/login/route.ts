import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { compare } from "bcryptjs";

if (!process.env.MONGODB_URI) throw new Error("env error");
const uri: string = process.env.MONGODB_URI;

async function handler(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { result: false, error: "Method not allowed" },
      { status: 405 }
    );
  }

  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { result: false, error: "모든 필드를 입력해야 해요!" },
      { status: 400 }
    );
  }

  const client = await MongoClient.connect(uri);
  const db = client.db();

  try {
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return NextResponse.json(
        { result: false, error: "가입된 사용자가 아니에요!" },
        { status: 401 }
      );
    }

    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { result: false, error: "비밀번호가 틀렸어요!" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        result: true,
        message: "로그인 성공!",
        user: { email: user.email, username: user.username },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Route not valid" }, { status: 500 });
  } finally {
    client.close();
  }
}

export { handler as POST };
