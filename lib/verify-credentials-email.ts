import "server-only";
import { supabase } from "@/lib/supabase";
import { Database } from "@/database.types";

type DbUser = Database["next_auth"]["Tables"]["users"]["Row"];

export async function verifyCredentialsEmail(token: string): Promise<DbUser> {
  // First find and validate the token with proper type safety
  const { data: verificationData, error: tokenError } = await supabase
    .schema("next_auth")
    .from("verification_tokens")
    .select("*")
    .eq("token", token)
    .single();

  // Handle potential token fetch errors
  if (tokenError) {
    console.error("Error fetching verification token:", tokenError);
    throw new Error("Failed to verify email");
  }

  // Check if token exists and is valid
  if (!verificationData) {
    throw new Error("Invalid verification token");
  }

  // Check if token has expired
  if (new Date(verificationData.expires) < new Date()) {
    // Clean up expired token before throwing error
    await supabase
      .schema("next_auth")
      .from("verification_tokens")
      .delete()
      .eq("token", token);

    throw new Error("Verification token has expired");
  }

  // Update the user's verification status with error handling
  const { data: userData, error: updateError } = await supabase
    .schema("next_auth")
    .from("users")
    .update({ credentials_email_verified: true })
    .eq("email", verificationData.identifier)
    .select()
    .single();

  if (updateError || !userData) {
    console.error("Error updating user verification status:", updateError);
    throw new Error("Failed to verify email");
  }

  // Delete the used token with error handling
  const { error: deleteError } = await supabase
    .schema("next_auth")
    .from("verification_tokens")
    .delete()
    .eq("token", token);

  if (deleteError) {
    // Log the error but don't throw - token cleanup failure
    // shouldn't affect the verification success
    console.error("Error deleting used verification token:", deleteError);
  }

  return userData;
}
