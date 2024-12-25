import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  // First extend the User interface
  interface User {
    role?: string;
  }

  // Then extend the Session interface, being explicit about the user property
  interface Session {
    user: {
      role?: string;
    } & DefaultSession["user"]; // Merge with the default user properties
  }
}

// Extend JWT in a separate module declaration
declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}
