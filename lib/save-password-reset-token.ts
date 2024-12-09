import "server-only";
import { supabase } from "@/lib/supabase";

export async function savePasswordResetToken(
  email: string,
  resetToken: string
) {
  try {
    // First check if this user exists
    const { data: user, error: userError } = await supabase
      .schema("next_auth")
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (userError || !user) {
      // Don't reveal if the user exists or not
      return { success: true };
    }

    // Delete any existing reset tokens for this user
    await supabase
      .schema("next_auth")
      .from("verification_tokens")
      .delete()
      .eq("identifier", email);

    // Insert new reset token
    const { error: insertError } = await supabase
      .schema("next_auth")
      .from("verification_tokens")
      .insert({
        identifier: email,
        token: resetToken,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        reset_password_token: resetToken,
        reset_password_token_expires_at: new Date(
          Date.now() + 24 * 60 * 60 * 1000
        ).toISOString(),
      });

    if (insertError) {
      throw insertError;
    }

    return { success: true };
  } catch (error) {
    console.error("Error saving reset token:", error);
    throw new Error("Failed to process password reset request");
  }
}
