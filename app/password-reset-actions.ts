"use server";

import { z } from "zod";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { sendPasswordResetEmail } from "@/lib/send-password-reset-email";
import { savePasswordResetToken } from "@/lib/save-password-reset-token";
import { randomBytes } from "node:crypto";
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
    // First save the token
    const tokenResult = await savePasswordResetToken(email, resetPasswordToken);

    // Redirect without sending email if:
    // 1. User not found
    // 2. Active token exists
    if (
      tokenResult.success &&
      (tokenResult.message === "User doesn't exist" ||
        tokenResult.message === "Active reset token exists")
    ) {
      redirect("/forgot-password/check-email");
    }

    // Send email only for newly created tokens
    if (
      tokenResult.success &&
      tokenResult.message === "Reset token saved successfully"
    ) {
      try {
        await sendPasswordResetEmail(email, resetPasswordToken);
        redirect("/forgot-password/check-email");
      } catch (emailError) {
        console.error("Failed to send password reset email:", emailError);
        return submission.reply({
          formErrors: ["Failed to send reset email."],
        });
      }
    }

    // If token save failed
    return submission.reply({
      formErrors: ["Something went wrong. Please try again."],
    });
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
