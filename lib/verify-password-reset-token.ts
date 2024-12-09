import "server-only";
import { supabase } from "@/lib/supabase";

export async function verifyPasswordResetToken(token: string) {
  // Fetch the reset token record
  const { data: tokenData, error: tokenError } = await supabase
    .schema("next_auth")
    .from("verification_tokens")
    .select("*")
    .eq("reset_password_token", token)
    .single();

  if (tokenError) {
    console.error("Error fetching reset token:", tokenError);
    throw new Error("Invalid or expired reset link");
  }

  if (!tokenData || !tokenData.identifier) {
    throw new Error("Invalid or expired reset link");
  }

  // Check if the token has expired
  if (new Date(tokenData.reset_password_token_expires_at) < new Date()) {
    try {
      // Clean up expired token
      await supabase
        .schema("next_auth")
        .from("verification_tokens")
        .delete()
        .eq("reset_password_token", token);
    } catch (error) {
      console.error("Failed to delete expired token:", error);
    }

    throw new Error("Password reset link has expired");
  }

  return {
    email: tokenData.identifier,
  };
}
