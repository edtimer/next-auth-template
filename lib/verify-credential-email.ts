import "server-only";
import { supabase } from "@/lib/supabase";
import { VerifyCredentialEmailError } from "@/lib/verify-credential-email-error";

export async function verifyCredentialEmail(token: string) {
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
      throw new VerifyCredentialEmailError("TOKEN_INVALID");
    }

    // Check the token expiration
    if (new Date(tokenData.expires) < new Date()) {
      throw new VerifyCredentialEmailError("TOKEN_EXPIRED");
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
      throw new VerifyCredentialEmailError("INTERNAL_ERROR");
    }

    // If verification succeeded, clean up the used token
    const { error: deleteError } = await supabase
      .schema("next_auth")
      .from("verification_tokens")
      .delete()
      .eq("token", token);

    if (deleteError) {
      throw new VerifyCredentialEmailError("INTERNAL_ERROR");
    }

    return userData;
  } catch (error) {
    if (error instanceof VerifyCredentialEmailError) {
      throw error;
    }

    throw new VerifyCredentialEmailError("INTERNAL_ERROR");
  }
}
