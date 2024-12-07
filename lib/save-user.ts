import "server-only";
import bcrypt from "bcrypt";
import { randomBytes } from "node:crypto";
import { supabase } from "@/lib/supabase";
import { Database } from "@/database.types";

type DbUser = Database["next_auth"]["Tables"]["users"]["Row"];

export async function saveUser(
  email: string,
  password: string
): Promise<{
  user: DbUser | null;
  status: "created" | "verification_sent";
  message?: string;
}> {
  // Generate the verification token
  const verificationToken = randomBytes(32).toString("hex");

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Start a transaction to ensure both user creation and token insertion succeed
  const { data: user, error: userError } = await supabase
    .schema("next_auth")
    .from("users")
    .insert({
      email,
      password: hashedPassword,
      credentials_email_verified: false, // Using our new column
    })
    .select("*")
    .single();

  if (userError) {
    console.error("Error inserting new user:", userError);
    throw new Error("Failed to create user account");
  }

  // Insert the verification token into the verification_tokens table
  const { error: tokenError } = await supabase
    .schema("next_auth")
    .from("verification_tokens")
    .insert({
      token: verificationToken,
      identifier: email,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    });

  if (tokenError) {
    // If token insertion fails, we should clean up the user we just created
    await supabase.schema("next_auth").from("users").delete().eq("id", user.id);

    console.error("Error inserting verification token:", tokenError);
    throw new Error("Failed to create verification token");
  }

  return {
    user,
    status: "verification_sent",
    message: "Verification email has been sent",
  };
}
