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
  } catch (error) {
    console.log("Credentials sign in error: ", error.cause.err);
    const errorMessage = error.cause.err.message;
    // Handle authentication errors
    if (error instanceof AuthError) {
      return submission.reply({
        formErrors: [errorMessage],
      });
    }

    // Handle unexpected errors
    return submission.reply({
      formErrors: ["Something went wrong."],
    });
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
