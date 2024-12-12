"use server";

import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { checkUserExists } from "@/lib/check-user-exists";
import { sendPasswordResetEmail } from "@/lib/send-password-reset-email";
import { createPasswordResetToken } from "@/lib/create-password-reset-token";
import { randomBytes } from "node:crypto";
import { forgotPasswordSchema, resetPasswordSchema } from "@/app/schema";
import { verifyPasswordResetToken } from "@/lib/verify-password-reset-token";
import { updatePassword } from "@/lib/update-passsord";
import { ResetPasswordTokenVerificationError } from "@/lib/token-verification-error";
import { UpdatePasswordError } from "@/lib/update-password-error";
import { CheckUserExistsError } from "@/lib/check-user-exists-error";

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

  let errorOccured = false;

  try {
    // Check if user exists
    await checkUserExists(email);

    // Create reset token
    await createPasswordResetToken(email, resetPasswordToken);

    // Send email
    await sendPasswordResetEmail(email, resetPasswordToken);
  } catch (error) {
    errorOccured = true;
    if (error instanceof CheckUserExistsError) {
      return submission.reply({
        formErrors: [CheckUserExistsError.getErrorMessage(error.code)],
      });
    }
    return submission.reply({
      formErrors: ["Something went wrong."],
    });
  } finally {
    if (!errorOccured) {
      redirect("/forgot-password/email-sent");
    }
  }
}

// Reset user password
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

  if (!token) {
    return submission.reply({
      formErrors: ["Reset token not found."],
    });
  }

  let errorOccured = false;

  try {
    const { email } = await verifyPasswordResetToken(token);
    await updatePassword(email!, submission.value.password);
  } catch (error) {
    errorOccured = true;
    if (error instanceof ResetPasswordTokenVerificationError) {
      switch (error.code) {
        case "TOKEN_EXPIRED":
          return submission.reply({
            formErrors: ["Reset token has expired."],
          });
          break;
        case "TOKEN_INVALID":
          return submission.reply({
            formErrors: ["Reset token is invalid."],
          });
          break;
        case "SYSTEM_ERROR":
          return submission.reply({
            formErrors: ["Something went wrong."],
          });
          break;
      }
    }
    if (error instanceof UpdatePasswordError) {
      switch (error.code) {
        case "PASSWORD_UPDATE_FAILED":
          return submission.reply({
            formErrors: ["Failed to update password."],
          });
          break;
      }
    }
  } finally {
    if (!errorOccured) {
      redirect("/reset-password/success");
    }
  }
}
