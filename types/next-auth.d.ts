// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

// First, we extend the User interface
declare module "next-auth" {
  interface User extends DefaultUser {
    role: string;
  }

  // Then, we extend the Session interface
  interface Session extends DefaultSession {
    user: User;
  }
}

// We need to declare this as a separate module
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: string;
  }
}
