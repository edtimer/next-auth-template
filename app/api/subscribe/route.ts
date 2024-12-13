import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get("email")!;

  try {
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
