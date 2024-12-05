import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import bcrypt from "bcrypt";
import { supabase } from "@/lib/supabase";
import { Database } from "@/database.types";

type DbUser = Database["next_auth"]["Tables"]["users"]["Row"];

type UserDTO = Pick<DbUser, "id" | "name" | "email" | "image">;

async function getUser(email: string): Promise<DbUser | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    return null;
  }

  return data;
}

async function saveUser(
  email: string,
  password: string
): Promise<DbUser | null> {
  return data;
}

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
          await saveUser(email, password);
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (passwordsMatch) return user;

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
