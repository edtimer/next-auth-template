import "server-only";
import { supabase } from "@/lib/supabase";

export async function checkCredentialsEmailVerificationStatus(email: string) {
  // First, get the user's verification status from the users table
  const { data: user, error: userError } = await supabase
    .schema("next_auth")
    .from("users")
    .select("credentials_email_verified")
    .eq("email", email)
    .single();

  if (userError) {
    console.error("Error checking user verification status:", userError);
    throw new Error("Failed to check credentials email verification status");
  }

  // If credentials email is already verified, we're good to go
  if (user.credentials_email_verified) {
    return { verified: true };
  }

  // At this point, the user exists, but the email is not confirmed
  // Check the expiry of the verification token
  const { data: token, error: tokenError } = await supabase
    .schema("next_auth")
    .from("verification_tokens")
    .select("expires")
    .eq("identifier", email)
    .single();

  if (tokenError) {
    console.error("Error checking verification token:", tokenError);
    throw new Error("Failed to check verification token");
  }

  // If the token has expired, we should allow sending a new one
  if (new Date(token.expires) < new Date()) {
    return { verified: false, canResendVerificationMail: true };
  }

  // Token exists and hasn't expired
  return {
    verified: false,
    canResendVerificationMail: false,
  };
}
