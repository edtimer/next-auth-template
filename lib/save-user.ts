import "server-only";
import bcrypt from "bcrypt";
import { supabase } from "@/lib/supabase";
import { Database } from "@/database.types";

type DbUser = Database["next_auth"]["Tables"]["users"]["Row"];

export async function saveUser(
  email: string,
  password: string
): Promise<DbUser | null> {
  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .schema("next_auth")
    .from("users")
    .insert({
      email,
      password: hashedPassword,
    })
    .select("*")
    .single();

  if (error) {
    console.error("Error inserting new user: ", error);
    throw new Error("Something went wrong.");
  }

  return data;
}
