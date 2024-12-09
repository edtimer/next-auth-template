"use server";

import { z } from "zod";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { sendPasswordResetEmail } from "@/lib/send-password-reset-email";
import { savePasswordResetToken } from "@/lib/save-password-reset-token";
import { randomBytes } from "node:crypto";
import { updatePassword } from "@/lib/update-passsord";
import { verifyPasswordResetToken } from "@/lib/verify-password-reset-token";

export async function requestPasswordReset(
  prevState: unknown,
  formData: FormData
) {
  const submission = parseWithZod(formData, {
    schema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const email = submission.value.email;
  const resetToken = randomBytes(32).toString("hex");

  try {
    // Save the reset token first
    await savePasswordResetToken(email, resetToken);

    // Then send the email
    const emailResult = await sendPasswordResetEmail(email, resetToken);

    if (!emailResult.success) {
      return submission.reply({
        formErrors: ["Failed to send reset email. Please try again."],
      });
    }

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
