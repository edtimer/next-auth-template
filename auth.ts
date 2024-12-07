import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import { getUser } from "@/lib/get-user";
import { saveUser } from "@/lib/save-user";
import { sendCredentialEmailVerificationEmail } from "@/lib/send-credentials-email-verification-email";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  debug: true,
  session: { strategy: "jwt" },
  providers: [
    Google({ allowDangerousEmailAccountLinking: true }),
    Credentials({
      authorize: async (credentials, req) => {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        const user = await getUser(email);

        // The user is not found, so the user is either signing in for the first time or has entered wrong email
        // We will assume that the user is signing in for the first time
        // We have no way to know if the user has entered the wrong email
        if (!user) {
          await sendCredentialEmailVerificationEmail(email);
          const result = await saveUser(email, password);
          if (result.user) {
            return {
              id: result.user.id,
              email: result.user.email,
              __type: "verification_pending",
            };
          }
        }

        // At this step, the user exists, so e need to check whether passwords match
        const passwordsMatch = await bcrypt.compare(password, user!.password!);
        // If passwords match, return user, which creates a session
        if (passwordsMatch) return user;

        // At this step, the user has entered the right email but wrong password
        throw new Error("Invalid email or password");
      },
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
});
