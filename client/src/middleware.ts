import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname, origin } = req.nextUrl;

    if (pathname.startsWith("/document") && token?.role === undefined) {
      return NextResponse.redirect(`${origin}/unauthorized`);
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/document/:path*", "/profile", "/setting", "/chat", "/peer"],
};
