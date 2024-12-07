import { randomBytes } from "node:crypto";
import { render } from "@react-email/render";
import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "@/lib/aws";
import { EmailVerificationTemplate } from "@/components/email-verification-template";

export async function sendCredentialEmailVerificationEmail(email: string) {
  const token = randomBytes(32).toString("hex");

  // Ensure we have the required environment variables
  if (!process.env.NEXTAUTH_URL) {
    throw new Error("NEXTAUTH_URL environment variable is not set");
  }
  if (!process.env.AWS_SES_FROM_EMAIL) {
    throw new Error("AWS_SES_FROM_EMAIL environment variable is not set");
  }

  // Create verification URL with base64url encoded token for safer URLs
  const verificationUrl = new URL("/verify-email", process.env.NEXTAUTH_URL);
  verificationUrl.searchParams.set("token", token);

  try {
    // Render the email template
    const emailHtml = await render(
      EmailVerificationTemplate({
        verificationUrl: verificationUrl.toString(),
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
          Data: "Verify your email address",
        },
      },
      Source: process.env.AWS_SES_FROM_EMAIL,
    });

    // Send the email
    await sesClient.send(sendEmailCommand);

    return {
      token,
      success: true,
    };
  } catch (error) {
    // Log the full error for debugging but don't expose it to the caller
    console.error("Failed to send verification email:", error);

    return {
      success: false,
      error: "Failed to send verification email",
    };
  }
}
