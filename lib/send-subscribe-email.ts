import { render } from "@react-email/render";
import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "@/lib/aws";
import { SubscribeTemplate } from "@/components/subscribe-template";

export async function sendSubscribeEmail(email: string) {
  // Create a URL with the email
  const subscribeUrl = new URL("/api/subscribe", process.env.NEXTAUTH_URL);
  subscribeUrl.searchParams.set("email", email);

  try {
    // Render the email template
    const emailHtml = await render(
      SubscribeTemplate({
        url: subscribeUrl.toString(),
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
      throw new Error("Failed to send subscribe email.");
    }
  } catch (error: any) {
    if (error.message === "Failed to send subscribe email.") {
      throw error;
    }
  }
}
