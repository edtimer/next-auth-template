import * as React from "react";
import { Button } from "@react-email/button";
import { Html } from "@react-email/html";
import { Tailwind } from "@react-email/tailwind";
import { Text } from "@react-email/text";

export function EmailVerificationTemplate({
  verificationUrl,
}: {
  verificationUrl: string;
}) {
  return (
    <Html>
      <Tailwind>
        <Text className="text-base font-medium text-slate-900">Hey,</Text>
        <Text className="text-base font-medium text-slate-900">
          Click the link below to verify your account.
        </Text>
        <Button
          href={verificationUrl}
          className="rounded bg-sky-600 px-4 py-2 text-base font-medium text-white"
        >
          Verify email
        </Button>
        <Text className="text-sm font-medium text-zinc-500">
          If you did not try to log in to your account, you can safely ignore
          this email.
        </Text>
      </Tailwind>
    </Html>
  );
}
