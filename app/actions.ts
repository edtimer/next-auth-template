"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { CallbackRouteError } from "@auth/core/errors";
import { parseWithZod } from "@conform-to/zod";
import { signInSchema } from "@/app/schema";
import { redirect } from "next/navigation";

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

  let errorOccured = false;

  try {
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
    });

    console.log(
      "Credentials sign in result (checking if I am getting back the return value from the authorize callback: ",
      result
    );
  } catch (error) {
    console.log("Error name: ", error.name);
    console.log("Error message: ", error.message);
    let errorMessage;
    if (
      error instanceof CallbackRouteError &&
      error.cause &&
      error.cause.err instanceof Error &&
      error.cause.provider === "credentials"
    ) {
      errorOccured = true;
      errorMessage = error.cause.err.message;
    } else {
      errorMessage = "Something went wrong.";
    }
    return submission.reply({
      formErrors: [errorMessage],
    });
  } finally {
    if (!errorOccured) {
      redirect(from);
    }
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
