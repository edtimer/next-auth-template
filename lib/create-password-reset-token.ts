import "server-only";
import { supabase } from "@/lib/supabase";
import { CreatePasswordResetTokenError } from "@/lib/create-password-reset-token-error";

export async function createPasswordResetToken(
  email: string,
  resetPasswordToken: string
) {
  try {
    // Delete existing token
    const { error: deleteTokenError } = await supabase
      .schema("next_auth")
      .from("reset_tokens")
      .delete()
      .eq("identifier", email);

    if (deleteTokenError) {
      console.error("Failed to delete password reset token:", deleteTokenError);
      throw new CreatePasswordResetTokenError("TOKEN_DELETION_FAILED");
    }

    // Create new token
    const { error: createTokenError } = await supabase
      .schema("next_auth")
      .from("reset_tokens")
      .insert({
        identifier: email,
        token: resetPasswordToken,
        expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      });

    if (createTokenError) {
      console.error("Failed to create password reset token:", deleteTokenError);
      throw new CreatePasswordResetTokenError("TOKEN_DELETION_FAILED");
    }
  } catch (error) {
    if (error instanceof CreatePasswordResetTokenError) {
      throw error;
    }
  }
}
