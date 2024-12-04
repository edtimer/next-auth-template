// middleware.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Define our routes - anything not in these arrays will be publicly accessible by default
const authRoutes = ["/signin"];
const protectedRoutes = ["/protected"];

export default auth((req) => {
  // Get the current path
  const path = req.nextUrl.pathname;

  // Check if user is authenticated
  const isAuthenticated = !!req.auth;

  // Check if current path is a protected or auth route
  const isProtectedRoute = protectedRoutes.includes(path);
  const isAuthRoute = authRoutes.includes(path);

  // If authenticated user tries to access auth routes like signin,
  // redirect them to home page
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If unauthenticated user tries to access protected routes,
  // redirect them to signin with callback URL
  if (!isAuthenticated && isProtectedRoute) {
    const redirectUrl = new URL("/signin", req.url);
    redirectUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(redirectUrl);
  }

  // Allow all other requests to proceed
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
