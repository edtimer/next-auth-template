import { render } from "@react-email/render";
import { randomBytes } from "node:crypto";
import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "@/lib/aws";
import { PasswordResetTemplate } from "@/components/password-reset-email-template";

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string
) {
  // Create reset URL with the token
  const resetUrl = new URL("/reset-password", process.env.NEXTAUTH_URL);
  resetUrl.searchParams.set("token", resetToken);

  try {
    // Render the email template
    const emailHtml = await render(
      PasswordResetTemplate({
        resetUrl: resetUrl.toString(),
      })
    );

    const sendEmailCommand = new SendEmailCommand({
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: emailHtml,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Reset your password",
        },
      },
      Source: process.env.AWS_SES_FROM_EMAIL,
    });

    await sesClient.send(sendEmailCommand);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    return {
      success: false,
      error: "Failed to send password reset email",
    };
  }
}
