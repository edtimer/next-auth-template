"use server";

import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { signinSchema } from "@/app/schema";

export async function signin(prevState: unknown, formData: FormData) {
  const submission = parseWithZod(formData, {
    schema: signinSchema,
  });

  if (submission.status !== "success") {
    console.log("Reply: ", submission.reply());
    return submission.reply();
  }

  console.log("Submission: ", submission);
}
