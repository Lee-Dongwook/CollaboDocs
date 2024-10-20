import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) throw new Error("env error");
const uri: string = process.env.MONGODB_URI;

export default NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "email",
          type: "text",
          placeholder: "이메일을 입력해주세요.",
        },
        password: {
          label: "password",
          type: "password",
          placeholder: "비밀번호를 입력해주세요.",
        },
      },
      async authorize(credentials) {
        const client = await MongoClient.connect(uri);

        const user = await client
          .db()
          .collection("users")
          .findOne({ email: credentials!.email });

        client.close();

        return { id: user!.id };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "google") {
        const client = await MongoClient.connect(uri);

        const user = await client.db().collection("users").findOne({
          email: token.email,
        });

        if (!user) {
          client.close();
          throw new Error("함께하고 있는 계정이 아니에요!");
        }
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
});
