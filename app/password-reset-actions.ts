"use server";

import { z } from "zod";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { sendPasswordResetEmail } from "@/lib/send-password-reset-email";
import { savePasswordResetToken } from "@/lib/save-password-reset-token";
import { randomBytes } from "node:crypto";
import { updatePassword } from "@/lib/update-passsord";
import { verifyPasswordResetToken } from "@/lib/verify-password-reset-token";
import { forgotPasswordSchema } from "@/app/schema";

export async function requestPasswordReset(
  prevState: unknown,
  formData: FormData
) {
  // Validate the form data
  const submission = parseWithZod(formData, {
    schema: forgotPasswordSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const email = submission.value.email;
  const resetPasswordToken = randomBytes(32).toString("hex");

  try {
    const [resetTokenResult, sendPasswordResult] = await Promise.all([
      savePasswordResetToken(email, resetPasswordToken),
      sendPasswordResetEmail(email, resetPasswordToken),
    ]);

    // Redirect to success page
    redirect("/forgot-password/check-email");
  } catch (error) {
    console.error("Password reset request failed:", error);
    return submission.reply({
      formErrors: ["Something went wrong. Please try again."],
    });
  }
}

const resetPasswordSchema = z.object({
  password: z.string(),
});

export async function resetPassword(
  email: string,
  token: string,
  prevState: unknown,
  formData: FormData
) {
  const submission = parseWithZod(formData, {
    schema: resetPasswordSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  try {
    // Verify token again as an extra security measure
    await verifyPasswordResetToken(token);

    // Update the password
    await updatePassword(email, submission.value.password);

    // Redirect to success page
    redirect("/reset-password/success");
  } catch (error) {
    console.error("Password reset failed:", error);
    return submission.reply({
      formErrors: [
        error instanceof Error
          ? error.message
          : "Failed to reset password. Please try again.",
      ],
    });
  }
}
