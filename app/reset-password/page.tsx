import Link from "next/link";
import { Icons } from "@/components/icons";
import { ResetPasswordForm } from "@/components/reset-passsword-form";
import { verifyPasswordResetToken } from "@/lib/verify-password-reset-token";
import { ResetPasswordTokenVerificationError } from "@/lib/token-verification-error";

export function ErrorMessage({
  code,
}: {
  code: keyof typeof ResetPasswordTokenVerificationError.errorMessages;
}) {
  const message = ResetPasswordTokenVerificationError.getErrorMessage(code);
  return (
    <div className="mx-auto max-w-sm mt-12 px-4 lg:px-8 text-center">
      <h2 className="text-red-600 text-2xl font-bold">
        Token Verification Error
      </h2>
      <p className="text-gray-700 my-4">{message}</p>
      <Link
        href="/forgot-password"
        className="flex justify-center items-center group p-2"
      >
        <Icons.arrowLeft className="size-4 inline-block mr-2 text-muted-foreground transform transition-transform group-hover:-translate-x-1 group-hover:text-primary" />
        Forgot password
      </Link>
    </div>
  );
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = (await searchParams).token;

  if (!token) {
    return <ErrorMessage code="TOKEN_NOT_FOUND" />;
  }

  try {
    await verifyPasswordResetToken(token);
  } catch (error) {
    if (error instanceof ResetPasswordTokenVerificationError) {
      switch (error.code) {
        case "TOKEN_EXPIRED":
          return <ErrorMessage code="TOKEN_EXPIRED" />;
          break;
        case "TOKEN_INVALID":
          return <ErrorMessage code="TOKEN_INVALID" />;
          break;
        case "SYSTEM_ERROR":
          return <ErrorMessage code="SYSTEM_ERROR" />;
          break;
      }
    }
  }

  return <ResetPasswordForm />;
}
