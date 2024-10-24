import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithCredentials, getUserByEmail } from "@/lib/authAction";

export const nextAuthOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
    error: "/error",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await signInWithCredentials({
          email: credentials?.email,
          password: credentials?.password,
        });

        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      console.log(account, profile);
      return true;
    },
    async jwt({ token, trigger, session }) {
      if (trigger === "update") {
        token.name = session.name;
      } else {
        if (token.email) {
          const user = await getUserByEmail({ email: token.email });

          token.name = user.name;
          token._id = user._id;
          token.role = user.role;
          token.provider = user.provider;
        }
      }
      return token;
    },

    async session({ session, token }) {
      console.log(session, token);

      return {
        ...session,
        user: {
          ...session.user,
          name: token.name,
          _id: token._id,
          role: token.role,
          provider: token.provider,
        },
      };
    },
  },
};
