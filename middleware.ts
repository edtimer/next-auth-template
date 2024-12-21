import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  // Get the pathname from the request URL
  const { nextUrl } = req;
  const path = nextUrl.pathname;

  // Get authentication status from the req.auth object
  const isAuthenticated = !!req.auth;

  // If authenticated users try to access the "/signin" route, redirect them to the home page
  if (isAuthenticated && path === "/signin") {
    return Response.redirect(new URL("/", nextUrl));
  }

  // Redirect unauthenticated users to signin page
  if (!isAuthenticated) {
    const signInUrl = new URL("/signin", nextUrl);
    // Store the original URL as a query param to redirect after signin
    signInUrl.searchParams.set("from", path);
    return Response.redirect(signInUrl);
  }

  // Allow the request to proceed normally for other routes
  return NextResponse.next();
});

// Configure which routes use the middleware
export const config = {
  matcher: ["/private/:path*", "/admin/:path*"],
};
