import type { EmailConfig } from "next-auth/providers";
import { sendEmailSignInLink } from "@/lib/send-email-signin-link";

// Define the expected parameters for sendVerificationRequest
interface SendVerificationRequestParams {
  identifier: string;
  url: string;
  expires: Date;
  provider: EmailConfig;
  token: string;
  request: Request;
}

export function CustomEmailProvider(): EmailConfig {
  return {
    id: "magic-link",
    type: "email",
    name: "Email Magic Link",
    from: process.env.AWS_SES_FROM_EMAIL,
    server: {},
    maxAge: 24 * 60 * 60, // 24 hours

    async sendVerificationRequest(params: SendVerificationRequestParams) {
      const { identifier: email, url } = params;
      await sendEmailSignInLink(email, url);
    },
  };
}
