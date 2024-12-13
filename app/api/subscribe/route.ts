import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get("email")!;

  try {
    // First, check if a user with this email already exists
    const { data: existingUser, error: lookupError } = await supabase
      .schema("next_auth")
      .from("subscribers")
      .select("*")
      .eq("email", email)
      .single();

    // If there was an error checking for the user, handle it
    if (lookupError) {
      console.error("Error checking for existing user:", lookupError);
      throw new Error("Failed to check existing user");
    }

    // If user exists, redirect to status page
    if (existingUser) {
      return NextResponse.redirect("/course/subscription/status");
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

    return NextResponse.redirect("/course/subscription/success");
  } catch (error) {
    return NextResponse.redirect("/course/subscription/error");
  }
}
