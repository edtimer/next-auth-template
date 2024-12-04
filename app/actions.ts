"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { parseWithZod } from "@conform-to/zod";
import { signInSchema } from "@/app/schema";

export async function signin(prevState: unknown, formData: FormData) {
  // First, validate the form data
  const submission = parseWithZod(formData, {
    schema: signInSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  try {
    await signIn("credentials", formData);
    // If successful, return a proper submission result
    return {
      status: "success" as const,
      error: undefined, // Changed from null to undefined
      value: submission.value,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      const errorMessage =
        error.type === "CredentialsSignin"
          ? "Invalid credentials"
          : "Something went wrong.";

      // Return error in the format Conform expects
      return {
        status: "error" as const,
        error: {
          // Use a special key '_form' for form-level errors
          _form: [errorMessage],
        },
        value: submission.value,
      };
    }
    throw error;
  }
}

export async function signInWithGoogle(
  callbackUrl: string,
  prevState: unknown,
  formData: FormData
) {
  console.log("Google callback URL: ", callbackUrl);
  try {
    await signIn("google", {
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return "Something went wrong with Google sign in.";
    }
    throw error;
  }
}

import { signOut } from "@/auth";

export async function handleSignOut() {
  await signOut();
}
