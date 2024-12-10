"use server";

import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { sendPasswordResetEmail } from "@/lib/send-password-reset-email";
import { savePasswordResetToken } from "@/lib/save-password-reset-token";
import { randomBytes } from "node:crypto";
import { forgotPasswordSchema, resetPasswordSchema } from "@/app/schema";

export async function requestPasswordReset(
  prevState: unknown,
  formData: FormData
) {
  // First, validate the form data
  const submission = parseWithZod(formData, {
    schema: forgotPasswordSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const email = submission.value.email;
  const resetPasswordToken = randomBytes(32).toString("hex");

  // Save the token and get result
  let tokenResult;
  try {
    tokenResult = await savePasswordResetToken(email, resetPasswordToken);
  } catch (error) {
    console.error("Password reset request failed:", error);
    return submission.reply({
      formErrors: ["Something went wrong. Please try again."],
    });
  }

  // Handle unsuccessful token save
  if (!tokenResult.success) {
    return submission.reply({
      formErrors: ["Something went wrong. Please try again."],
    });
  }

  // If user doesn't exist or has active token, redirect to check email page
  if (
    tokenResult.message === "User doesn't exist" ||
    tokenResult.message === "Active reset token exists"
  ) {
    redirect("/forgot-password/check-email");
  }

  // If we have a new token, try to send the email
  if (tokenResult.message === "Reset token saved successfully") {
    try {
      const emailResult = await sendPasswordResetEmail(
        email,
        resetPasswordToken
      );

      if (!emailResult.success) {
        return submission.reply({
          formErrors: ["Failed to send reset email. Please try again."],
        });
      }
    } catch (error) {
      console.error("Failed to send password reset email:", error);
      return submission.reply({
        formErrors: ["Failed to send reset email. Please try again."],
      });
    }
  }

  // If we get here successfully, redirect to check email page
  redirect("/forgot-password/check-email");
}

export async function resetPassword(
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
