import * as React from "react";
import { Button } from "@react-email/button";
import { Html } from "@react-email/html";
import { Tailwind } from "@react-email/tailwind";
import { Text } from "@react-email/text";

export function EmailSignInTemplate({ url }: { url: string }) {
  return (
    <Html>
      <Tailwind>
        <Text className="text-base font-medium text-gray-900">Hey,</Text>
        <Text className="text-base font-medium text-gray-900">
          Click the link below to sign in to your account:
        </Text>
        <Button
          href={url}
          className="rounded bg-blue-600 px-4 py-2 text-base font-medium text-white"
        >
          Sign In
        </Button>
        <Text className="text-base font-medium text-gray-900">
          Note that the link will expire in 1 hour.
        </Text>
        <Text className="text-sm font-medium text-gray-500">
          If you did not try to log in to your account, you can safely ignore
          this email.
        </Text>
      </Tailwind>
    </Html>
  );
}
