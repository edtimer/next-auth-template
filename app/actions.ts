"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { parseWithZod } from "@conform-to/zod";
import { signInSchema } from "@/app/schema";

export async function signInWithEmailAndPassword(
  from: string,
  prevState: unknown,
  formData: FormData
) {
  // First, validate the form data
  const submission = parseWithZod(formData, {
    schema: signInSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: from,
    });
    return {
      status: "success" as const,
      error: undefined,
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
  from: string,
  prevState: unknown,
  formData: FormData
) {
  try {
    await signIn("google", {
      redirectTo: from,
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
  await signOut({ redirectTo: "/" });
}
