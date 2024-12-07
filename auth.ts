import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import { getUser } from "@/lib/get-user";
import { saveUser } from "@/lib/save-user";

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

        if (!user) {
          const user = await saveUser(email, password);
          return user;
        }

        const passwordsMatch = await bcrypt.compare(password, user!.password!);
        console.log("Password matching status: ", passwordsMatch);

        if (passwordsMatch) return user;

        throw new Error("Invalid email or password");
      },
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
});
