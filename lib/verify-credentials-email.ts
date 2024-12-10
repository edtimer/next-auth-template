import "server-only";
import { supabase } from "@/lib/supabase";
import { VerifyEmailTokenVerificationError } from "@/lib/token-verification-error";

export async function verifyCredentialsEmail(token: string) {
  try {
    // Fetch the verification token record
    const { data: tokenData, error: tokenError } = await supabase
      .schema("next_auth")
      .from("verification_tokens")
      .select("*")
      .eq("token", token)
      .single();

    if (tokenError) {
      console.error("Error fetching verification token:", tokenError);
      throw new VerifyEmailTokenVerificationError("TOKEN_INVALID");
    }

    // Check the token expiration
    if (new Date(tokenData.expires) < new Date()) {
      throw new VerifyEmailTokenVerificationError("TOKEN_EXPIRED");
    }

    // Update the user's verification status
    const { data: userData, error: updateError } = await supabase
      .schema("next_auth")
      .from("users")
      .update({ credentials_email_verified: true })
      .eq("email", tokenData.identifier!)
      .select()
      .single();

    if (updateError) {
      throw new VerifyEmailTokenVerificationError("SYSTEM_ERROR");
    }

    // If verification succeeded, clean up the used token
    const { error: deleteError } = await supabase
      .schema("next_auth")
      .from("verification_tokens")
      .delete()
      .eq("token", token);

    if (deleteError) {
      // Log but don't throw - token cleanup isn't critical to verification success
      console.error(
        "Warning: Could not delete used verification token:",
        deleteError
      );
    }

    return userData;
  } catch (error) {
    // If it's our known error type, rethrow it
    if (error instanceof VerifyEmailTokenVerificationError) {
      throw error;
    }

    // For unexpected errors (network issues, etc.), log and throw a generic error
    console.error("Unexpected error during token verification:", error);
    throw new VerifyEmailTokenVerificationError("SYSTEM_ERROR");
  }
}
