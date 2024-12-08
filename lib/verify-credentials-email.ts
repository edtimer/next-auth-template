import "server-only";
import { supabase } from "@/lib/supabase";

export async function verifyCredentialsEmail(token: string) {
  // Fetch the verification record using the token
  const { data: verificationData, error: tokenError } = await supabase
    .schema("next_auth")
    .from("verification_tokens")
    .select("*")
    .eq("token", token)
    .single();

  // Handle any database errors during token fetch
  if (tokenError) {
    console.error("Error fetching verification token:", tokenError);
    throw new Error("Failed to verify email");
  }

  // Verify we have both the token record and a valid identifier
  if (!verificationData || !verificationData.identifier) {
    throw new Error("Invalid or expired verification link");
  }

  // Check if the token has expired
  if (new Date(verificationData.expires) < new Date()) {
    try {
      // Clean up expired token
      await supabase
        .schema("next_auth")
        .from("verification_tokens")
        .delete()
        .eq("token", token);
    } catch (error) {
      // Log cleanup error but continue with the main error
      console.error("Failed to delete expired token:", error);
    }

    throw new Error(
      "This verification link has expired. Please request a new one."
    );
  }

  try {
    // Update the user's verification status
    const { data: userData, error: updateError } = await supabase
      .schema("next_auth")
      .from("users")
      .update({ credentials_email_verified: true })
      .eq("email", verificationData.identifier) // Now TypeScript knows this is a string
      .select()
      .single();

    if (updateError || !userData) {
      throw new Error("Could not update verification status");
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
    console.error("Verification process failed:", error);
    throw new Error(
      "Could not verify your email address. Please try again or contact support."
    );
  }
}
