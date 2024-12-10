import "server-only";
import { supabase } from "@/lib/supabase";

export async function verifyPasswordResetToken(token: string) {
  // Fetch the reset token record
  const { data: tokenData, error: tokenError } = await supabase
    .schema("next_auth")
    .from("reset_tokens")
    .select("*")
    .eq("token", token)
    .single();

  if (tokenError) {
    console.error("Error fetching reset token:", tokenError);
    throw new Error("Invalid or expired reset link");
  }

  if (!tokenData) {
    throw new Error("Invalid token");
  }

  // Check if the token has expired
  // May be we can show an error UI
  // Token has expired
  if (new Date(tokenData.expires) < new Date()) {
  }

  return {
    email: tokenData.identifier,
  };
}
