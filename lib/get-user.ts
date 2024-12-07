import "server-only";
import { supabase } from "@/lib/supabase";
import { Database } from "@/database.types";

type DbUser = Database["next_auth"]["Tables"]["users"]["Row"];

export async function getUser(email: string): Promise<DbUser | null> {
  const { data, error } = await supabase
    .schema("next_auth")
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    console.log("Failed to get user:", error);
    throw new Error("Something went wrong.");
  }

  return data;
}
