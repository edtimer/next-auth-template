import * as React from "react";
import { Button } from "@react-email/button";
import { Html } from "@react-email/html";
import { Tailwind } from "@react-email/tailwind";
import { Text } from "@react-email/text";

export function EmailSignInTemplate({ url }: { url: string }) {
  return (
    <Html>
      <Tailwind>
        <Text className="text-base text-gray-700">Hey,</Text>
        <Text className="text-base text-gray-700">
          Click the link below to sign in to your account.
        </Text>
        <Text className="text-base text-gray-700 mt-4">
          The link will expire in 1 hour.
        </Text>
        <Button
          href={url}
          className="rounded bg-blue-600 px-2 py-1 text-base font-medium text-white mt-4"
        >
          Sign in
        </Button>
        <Text className="text-sm text-gray-500 mt-4">
          If you did not try to log in to your account, you can safely ignore
          this email.
        </Text>
      </Tailwind>
    </Html>
  );
}
