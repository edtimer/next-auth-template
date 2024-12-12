import "server-only";
import bcrypt from "bcrypt";
import { supabase } from "@/lib/supabase";
import { ResetPasswordError } from "@/lib/reset-password-error";

export async function resetPassword(email: string, newPassword: string) {
  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    const { data: user, error: updateError } = await supabase
      .schema("next_auth")
      .from("users")
      .update({ password: hashedPassword })
      .eq("email", email)
      .select()
      .single();

    if (updateError) {
      console.error("Failed to update password:", updateError);
      throw new ResetPasswordError("PASSWORD_RESET_FAILED");
    }

    // Clean up the reset token after successful password update
    const { error: deleteError } = await supabase
      .schema("next_auth")
      .from("reset_tokens")
      .delete()
      .eq("identifier", email);

    if (deleteError) {
      // Log but don't throw - token cleanup isn't critical to password update success
      console.error("Warning: Could not delete used reset token:", deleteError);
    }

    return { success: true };
  } catch (error) {
    // If it's our known error type, rethrow it
    if (error instanceof ResetPasswordError) {
      throw error;
    }
  }
}
