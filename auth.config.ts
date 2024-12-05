import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isSignedIn = !!auth?.user;
      const isOnSignInPage = nextUrl.pathname === "/signin";

      // Redirect authenticated users from /signin to the home pages
      if (isSignedIn && isOnSignInPage) {
        return Response.redirect(new URL("/", nextUrl));
      }
      // Allow all other requests to proceed
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
