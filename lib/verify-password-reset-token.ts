import "server-only";
import { supabase } from "@/lib/supabase";
import { ResetPasswordTokenVerificationError } from "@/lib/token-verification-error";

export async function verifyPasswordResetToken(token: string) {
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
      throw new ResetPasswordTokenVerificationError("TOKEN_INVALID");
    }

    // Check token expiration
    if (new Date(tokenData.expires) < new Date()) {
      throw new ResetPasswordTokenVerificationError("TOKEN_EXPIRED");
    }

    return {
      success: true,
      email: tokenData.identifier,
    };
  } catch (error) {
    // If it's our known error type, rethrow it
    if (error instanceof ResetPasswordTokenVerificationError) {
      throw error;
    }

    // For unexpected errors (network issues, etc.), log and throw a generic error
    console.error("Unexpected error during token verification:", error);
    throw new ResetPasswordTokenVerificationError("SYSTEM_ERROR");
  }
}
