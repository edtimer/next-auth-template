"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { CallbackRouteError } from "@auth/core/errors";
import { parseWithZod } from "@conform-to/zod";
import {
  signInWithEmailSchema,
  signInWithEmailAndPasswordSchema,
} from "@/app/schema";
import { redirect } from "next/navigation";

export async function signInWithEmail(
  from: string,
  prevState: unknown,
  formData: FormData
) {
  // Validate the form data
  const submission = parseWithZod(formData, {
    schema: signInWithEmailSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  let errorOccurred = false;

  try {
    await signIn(
      "magic-link",
      {
        email: formData.get("email"),
        redirect: false,
      },
      {
        callbackUrl: from,
      }
    );
  } catch (error) {
    errorOccurred = true;
    return submission.reply({
      formErrors: ["Something went wrong."],
    });
  } finally {
    if (!errorOccurred) {
      redirect("/signin/email-sent");
    }
  }
}

export async function signInWithEmailAndPassword(
  from: string,
  prevState: unknown,
  formData: FormData
) {
  // Validate the form data
  const submission = parseWithZod(formData, {
    schema: signInWithEmailAndPasswordSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  let errorOccured = false;

  try {
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      callbackUrl: from,
      redirect: false,
    });

    console.log(
      "Credentials sign in result (checking if I am getting back the return value from the authorize callback: ",
      result
    );
  } catch (error) {
    if (
      error instanceof CallbackRouteError &&
      error.cause &&
      error.cause.err instanceof Error &&
      error.cause.provider === "credentials"
    ) {
      errorOccured = true;

      // Check if this is our verification pending case
      if (error.cause.err.message === "Verification pending") {
        redirect(`/signin/verify-email`);
      }
      // If it's not verification pending, return the error message
      return submission.reply({
        formErrors: [error.cause.err.message],
      });
    }

    // Handle unexpected errors
    return submission.reply({
      formErrors: ["Something went wrong."],
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
