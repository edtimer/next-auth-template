import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get("email")!;

  console.log("Subscriber email: ", email);

  try {
    // First, check if a user with this email already exists
    const { data: existingUser, error: lookupError } = await supabase
      .schema("next_auth")
      .from("subscribers")
      .select("*")
      .eq("email", email)
      .single();

    // If user exists, redirect to status page
    if (existingUser) {
      return NextResponse.redirect(
        new URL("/course/subscribe/status", request.nextUrl.origin)
      );
    }

    // Create user
    const { error: userError } = await supabase
      .schema("next_auth")
      .from("subscribers")
      .insert({
        email,
      })
      .select("*")
      .single();

    if (userError) {
      console.error("Error inserting new user:", userError);
      throw new Error("Failed to create user");
    }

    return NextResponse.redirect(
      new URL("/course/subscribe/success", request.nextUrl.origin)
    );
  } catch (error) {
    return NextResponse.redirect(
      new URL("/course/subscribe/error", request.nextUrl.origin)
    );
  }
}
