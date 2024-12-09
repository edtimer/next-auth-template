import "server-only";
import { supabase } from "@/lib/supabase";

type TokenResult = {
  success: boolean;
  message?: string;
  error?: string;
};

export async function savePasswordResetToken(
  email: string,
  resetPasswordToken: string
): Promise<TokenResult> {
  try {
    // First check if this user exists
    const { data: user, error: userError } = await supabase
      .schema("next_auth")
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    // If user not found, return success to avoid email enumeration
    if (userError) {
      return {
        success: true,
        message: "User doesn't exist",
      };
    }

    // Check for existing reset token
    const { data: existingToken, error: tokenError } = await supabase
      .schema("next_auth")
      .from("verification_tokens")
      .select("*")
      .eq("identifier", email)
      .not("reset_password_token", "is", null)
      .single();

    if (existingToken) {
      // Check if existing token is still valid
      const now = new Date();
      const tokenExpiry = new Date(
        existingToken.reset_password_token_expires_at!
      );

      if (now < tokenExpiry) {
        return {
          success: true,
          message: "Active reset token exists",
        };
      }
    }

    const { error: upsertError } = await supabase
      .schema("next_auth")
      .from("verification_tokens")
      .upsert({
        identifier: email,
        reset_password_token: resetPasswordToken,
        reset_password_token_expires_at: new Date(
          Date.now() + 24 * 60 * 60 * 1000
        ).toISOString(),
      });

    if (upsertError) {
      throw new Error("Failed to save reset token");
    }

    return {
      success: true,
      message: "Reset token saved successfully",
    };
  } catch (error) {
    console.error("Failed to process password reset request:", error);
    return {
      success: false,
      error: "Failed to process request",
    };
  }
}
