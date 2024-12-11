import "server-only";
import { SendEmailCommand } from "@aws-sdk/client-ses";
import { render } from "@react-email/render";
import { sesClient } from "@/lib/aws";
import { EmailSignInTemplate } from "@/components/email-signin-template";

export async function sendEmailSignInLink(email: string, url: string) {
  try {
    // Render the email using react-email
    const emailHtml = await render(EmailSignInTemplate({ url }));

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
          Data: "Sign in link for your account",
        },
      },
      Source: process.env.AWS_SES_FROM_EMAIL,
    });

    await sesClient.send(sendEmailCommand);
    return { success: true };
  } catch (error) {
    console.error("Failed to send email login link:", error);
    return { success: false, error };
  }
}
