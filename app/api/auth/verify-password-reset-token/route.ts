import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

type TokenVerificationStatus =
  | "token-invalid"
  | "token-expired"
  | "internal-error"
  | "token-valid";

function getRedirectUrl(status: TokenVerificationStatus, token?: string) {
  if (status === "token-valid") {
    const path = `/reset-password?token=${token}`;
    console.log("Generated relative path:", path);
    return path;
  }
  const errorPath = `/reset-password/verify?error=${status}`;
  console.log("Generated error path:", errorPath);
  return errorPath;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");

  console.log("Current request URL:", request.url);
  console.log("Request nextUrl:", request.nextUrl.toString());
  console.log("Request base URL:", request.nextUrl.origin);

  try {
    const { data: tokenData, error: tokenError } = await supabase
      .schema("next_auth")
      .from("reset_tokens")
      .select("*")
      .eq("token", token!)
      .single();

    if (tokenError) {
      console.error("Error fetching password reset token:", tokenError);
      const redirectUrl = new URL(
        getRedirectUrl("token-invalid"),
        request.nextUrl.origin
      );
      return NextResponse.redirect(redirectUrl);
    }

    // Check token expiration
    if (new Date(tokenData.expires) < new Date()) {
      const redirectUrl = new URL(
        getRedirectUrl("token-expired"),
        request.nextUrl.origin
      );
      return NextResponse.redirect(redirectUrl);
    }

    // Valid token case - redirect to reset password page
    const redirectUrl = new URL(
      getRedirectUrl("token-valid"),
      request.nextUrl.origin
    );
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Unexpected error during token verification:", error);
    const redirectUrl = new URL(
      getRedirectUrl("internal-error"),
      request.nextUrl.origin
    );
    return NextResponse.redirect(redirectUrl);
  }
}
