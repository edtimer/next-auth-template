import { supabase } from "@/lib/supabase";
import { User } from "next-auth";

export async function handleUserCreation({ user }: { user: User }) {
  const ADMIN_EMAILS = ["rawgrittt@gmail.com"];

  // Determine if this email should have admin privileges
  const role = ADMIN_EMAILS.includes(user.email!) ? "admin" : "user";

  try {
    const { error } = await supabase
      .schema("next_auth")
      .from("users")
      .update({ role: role })
      .eq("email", user.email!);

    if (error) {
      console.error("Error updating user role:", error);
      throw error;
    }
  } catch (error) {
    console.log("Failed to assign role to new user:", error);
  }
}
