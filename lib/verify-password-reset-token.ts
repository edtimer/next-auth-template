import "server-only";
import { supabase } from "@/lib/supabase";
import { VerifyPasswordResetTokenError } from "@/lib/verify-password-reset-token-error";

type TokenVerificationResult = {
  success: true;
  email: string;
};

export async function verifyPasswordResetToken(
  token: string
): Promise<TokenVerificationResult> {
  try {
    // Fetch the reset token record
    const { data: tokenData, error: tokenError } = await supabase
      .schema("next_auth")
      .from("reset_tokens")
      .select("*")
      .eq("token", token)
      .single();

    if (tokenError) {
      console.error("Error fetching reset token:", tokenError);
      throw new VerifyPasswordResetTokenError("TOKEN_INVALID");
    }

    // Check token expiration
    if (new Date(tokenData.expires) < new Date()) {
      throw new VerifyPasswordResetTokenError("TOKEN_EXPIRED");
    }

    return {
      success: true,
      email: tokenData.identifier!,
    };
  } catch (error) {
    // If it's our known error type, rethrow it
    if (error instanceof VerifyPasswordResetTokenError) {
      throw error;
    }
    throw new VerifyPasswordResetTokenError("INTERNAL_ERROR");
  }
}
