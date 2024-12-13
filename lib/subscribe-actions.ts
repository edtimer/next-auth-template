"use server";

import { parseWithZod } from "@conform-to/zod";
import { subscribeSchema } from "@/app/schema";
import { sendSubscribeEmail } from "@/lib/send-subscribe-email";
import { redirect } from "next/navigation";

export async function subscribe(prevState: unknown, formData: FormData) {
  // Validate the form data
  const submission = parseWithZod(formData, {
    schema: subscribeSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const email = submission.value.email;
  let errorOccured = false;

  try {
    await sendSubscribeEmail(email);
  } catch (error) {
    errorOccured = true;
    return submission.reply({
      formErrors: ["Something went wrong."],
    });
  } finally {
    if (!errorOccured) {
      redirect("");
    }
  }
}
