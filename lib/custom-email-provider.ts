import type { EmailConfig } from "next-auth/providers";
import { sendEmailSignInLink } from "@/lib/send-email-signin-link";

export function customEmailProvider(): EmailConfig {
  return {
    id: "ses",
    type: "email",
    name: "Email",
    maxAge: 60 * 60,

    async sendVerificationRequest({ identifier: email, url }) {
      await sendEmailSignInLink(email, url);
    },
  };
}
