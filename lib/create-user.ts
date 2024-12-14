import "server-only";
import bcrypt from "bcrypt";
import { supabase } from "@/lib/supabase";
import { CreateUserError } from "@/lib/create-user-error";

const adminEmails = ["rawgrittt@gmail.com"];

export async function createUser(
  email: string,
  password: string,
  verificationToken: string
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const role = adminEmails.includes(email.toLowerCase()) ? "admin" : "user";

  try {
    // Create user
    const { error: userError } = await supabase
      .schema("next_auth")
      .from("users")
      .insert({
        email,
        password: hashedPassword,
        credentials_email_verified: false,
        role,
      })
      .select("*")
      .single();

    if (userError) {
      console.error("Error inserting new user:", userError);
      throw new CreateUserError("USER_CREATION_FAILED");
    }

    // Insert the verification token into the verification_tokens table
    const { error: tokenError } = await supabase
      .schema("next_auth")
      .from("verification_tokens")
      .insert({
        token: verificationToken,
        identifier: email,
        expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
      });

    if (tokenError) {
      // If token insertion fails, delete the user we just created
      const { error: userDeletionError } = await supabase
        .schema("next_auth")
        .from("users")
        .delete()
        .eq("email", email);

      if (userDeletionError) {
        console.error("Error deleting user:", userDeletionError);
        throw new CreateUserError("USER_DELETION_FAILED");
      }

      // If we successfully deleted the user, we should still throw an error
      // about the original token creation failure
      throw new CreateUserError("TOKEN_CREATION_FAILED");
    }

    return {
      success: true,
      message: "User created",
    };
  } catch (error) {
    if (error instanceof CreateUserError) {
      throw error;
    }
    throw new CreateUserError("INTERNAL_ERROR");
  }
}
