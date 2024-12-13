import "server-only";
import { supabase } from "@/lib/supabase";
import { CheckSubscriberExistsError } from "@/lib/check-subscriber-exists-error";

export async function checkSubscriberExists(email: string) {
  try {
    const { error: userError } = await supabase
      .schema("next_auth")
      .from("subscribers")
      .select("*")
      .eq("email", email)
      .single();

    if (userError) {
      console.log("User exists error: ", userError);
      throw new CheckSubscriberExistsError("USER_NOT_FOUND");
    }
    return {
      success: true,
    };
  } catch (error) {
    return {
      error: true,
    };
  }
}
