import "server-only";
import { supabase } from "@/lib/supabase";
import { CheckUserExistsError } from "@/lib/check-user-exists-error";

export async function checkUserExists(email: string): Promise<void> {

  try {
    const { error: userError } = await supabase
      .schema("next_auth")
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (userError) {
      console.log("User exists error: ", userError);
      throw new CheckUserExistsError("USER_NOT_FOUND");
    }
  } catch (error) {
    if (error instanceof CheckUserExistsError) {
      throw error;
    }
  }
}
