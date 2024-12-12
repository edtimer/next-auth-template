import "server-only";
import { supabase } from "@/lib/supabase";

type TokenResult = {
  success: boolean;
  message?: string;
};

export async function savePasswordResetToken(
  email: string,
  resetPasswordToken: string
): Promise<TokenResult> {
  try {
    // Delete existing token
    const { error: deleteTokenError } = await supabase
      .schema("next_auth")
      .from("reset_tokens")
      .delete()
      .eq("identifier", email);

    if (deleteTokenError) {
      console.error("Failed to delete expired token:", deleteTokenError);
      throw new Error("Failed to clean up expired token");
    }

    // Create new token
    const { error: createTokenError } = await supabase
      .schema("next_auth")
      .from("reset_tokens")
      .insert({
        identifier: email,
        token: resetPasswordToken,
        expires: new Date(Date.now() + 60 * 1000).toISOString(),
      });

    if (createTokenError) {
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
      message: "Failed to process request",
    };
  }
}
