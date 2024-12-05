import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const authRoutes = ["/signin"];
      const protectedRoutes = ["/private"];

      const isAuthenticated = !!auth?.user;
      const path = nextUrl.pathname;

      // Check if the current path is an auth route (signin)
      const isAuthRoute = authRoutes.includes(path);

      // Check if the current path is a protected route
      const isProtectedRoute = protectedRoutes.some((route) =>
        // Use startsWith to catch nested routes like /private/123
        path.startsWith(route)
      );

      // If user is authenticated and tries to access an auth route,
      // redirect them to the home page
      if (isAuthenticated && isAuthRoute) {
        return Response.redirect(new URL("/", nextUrl));
      }

      // If user is not authenticated and tries to access a protected route,
      // redirect them to the signin page with the from query param
      if (!isAuthenticated && isProtectedRoute) {
        const signInUrl = new URL("/signin", nextUrl);
        signInUrl.searchParams.set("from", path);
        return Response.redirect(signInUrl);
      }

      // Allow all other requests to proceed
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
