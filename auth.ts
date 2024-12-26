import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import { customEmailProvider } from "@/lib/custom-email-provider";
import { authorizeCredentials } from "@/lib/authorize-credentials";
import { handleAuthRedirect } from "@/lib/handle-auth-redirect";
import { assignUserRole } from "@/lib/assign-user-role";
import { handleAuthJwt } from "@/lib/handle-auth-jwt";
import { handleAuthSession } from "@/lib/handle-auth-session";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  debug: false,
  session: { strategy: "jwt" },
  events: { createUser: assignUserRole },
  callbacks: {
    redirect: handleAuthRedirect,
    jwt: handleAuthJwt,
    session: handleAuthSession,
  },
  providers: [
    Google({ allowDangerousEmailAccountLinking: true }),
    customEmailProvider(),
    Credentials({
      authorize: authorizeCredentials,
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  pages: { error: "/auth-error" },
});
