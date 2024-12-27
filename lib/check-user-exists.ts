import "server-only";
import { supabase } from "@/lib/supabase";

export async function checkUserExists(email: string) {
  try {
    const { data, error } = await supabase
      .schema("next_auth")
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      console.log("Failed to check user existence:", error.message);
    }

    return data;
  } catch (error) {
    console.error("Unexpected error while checking user existence:", error);
    return null;
  }
}
