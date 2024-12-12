import { render } from "@react-email/render";
import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "@/lib/aws";
import { PasswordResetTemplate } from "@/components/password-reset-email-template";
import { SendPasswordResetEmailError } from "@/lib/send-password-reset-email-error";

export async function sendPasswordResetEmail(
  email: string,
  resetPasswordToken: string
) {
  // Create reset URL with the token
  const resetUrl = new URL(
    "/api/auth/verify-password-reset-token",
    process.env.NEXTAUTH_URL
  );
  resetUrl.searchParams.set("token", resetPasswordToken);

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

    const result = await sesClient.send(sendEmailCommand);

    if (!result.MessageId) {
      throw new SendPasswordResetEmailError("EMAIL_SEND_FAILED");
    }
  } catch (error) {
    if (error instanceof SendPasswordResetEmailError) {
      throw error;
    }
  }
}
