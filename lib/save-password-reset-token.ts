import "server-only";
import { supabase } from "@/lib/supabase";

export async function savePasswordResetToken(
  email: string,
  resetPasswordToken: string
) {
  try {
    // First check if this user exists
    const { data: user, error: userError } = await supabase
      .schema("next_auth")
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (userError) {
      console.log("User not found.");
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Failed to process password reset request:", error);
    throw new Error("Failed to process password reset request");
  }
}
