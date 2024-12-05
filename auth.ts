import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import bcrypt from "bcrypt";

async function getUser(email: string) {}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  debug: true,
  session: { strategy: "jwt" },
  providers: [
    Google,
    Credentials({
      authorize: async (credentials, req) => {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        const user = await getUser(email);

        if (!user) {
          // Create user
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
});
