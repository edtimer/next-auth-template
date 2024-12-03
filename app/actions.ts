"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { signInSchema } from "@/app/schema";

export async function signin(prevState: unknown, formData: FormData) {
  const submission = parseWithZod(formData, {
    schema: signInSchema,
  });

  if (submission.status !== "success") {
    console.log("Reply: ", submission.reply());
    return submission.reply();
  }

  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
