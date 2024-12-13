"use server";

import { parseWithZod } from "@conform-to/zod";
import { subscribeSchema } from "@/app/schema";
import { redirect } from "next/navigation";

export async function subscribe(
  prevState: unknown,
  formData: FormData
) {
  // Validate the form data
  const submission = parseWithZod(formData, {
    schema: subscribeSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  let errorOccurred = false;

  try {
  } catch (error) {
  } finally {
  }
}
