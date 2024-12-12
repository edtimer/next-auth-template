import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

export type TokenVerificationStatus =
  | "token-invalid"
  | "token-expired"
  | "internal-error"
  | "token-valid";

function getRedirectUrl(status: TokenVerificationStatus) {
  if (status === "token-valid") {
    return "/reset-password";
  }

  return `/reset-password/verify?error=${status}`;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");

  try {
    const { data: tokenData, error: tokenError } = await supabase
      .schema("next_auth")
      .from("reset_tokens")
      .select("*")
      .eq("token", token!)
      .single();

    if (tokenError) {
      console.error("Error fetching password reset token:", tokenError);
      return NextResponse.redirect(getRedirectUrl("token-invalid"));
    }

    // Check token expiration
    if (new Date(tokenData.expires) < new Date()) {
      return NextResponse.redirect(getRedirectUrl("token-expired"));
    }

    // Valid token case - redirect to reset password page
    return NextResponse.redirect(getRedirectUrl("token-valid"));
  } catch (error) {
    console.error("Unexpected error during token verification:", error);
    return NextResponse.redirect(getRedirectUrl("internal-error"));
  }
}
