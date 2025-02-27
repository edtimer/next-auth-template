import Link from "next/link";
import { Icons } from "@/components/icons";
import { ErrorMessage } from "@/lib/error-message";
import { verifyCredentialEmail } from "@/lib/verify-credential-email";
import { VerifyCredentialEmailError } from "@/lib/verify-credential-email-error";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const token = (await searchParams).token;

  // First handle the case where no token is provided
  if (!token) {
    return <ErrorMessage code="TOKEN_NOT_FOUND" />;
  }

  try {
    await verifyCredentialEmail(token);
  } catch (error) {
    if (error instanceof VerifyCredentialEmailError) {
      switch (error.code) {
        case "TOKEN_EXPIRED":
          return <ErrorMessage code="TOKEN_EXPIRED" />;
          break;
        case "TOKEN_INVALID":
          return <ErrorMessage code="TOKEN_INVALID" />;
          break;
        case "INTERNAL_ERROR":
          return <ErrorMessage code="INTERNAL_ERROR" />;
          break;
      }
    }
  }

  // Verification successful
  return (
    <div className="mx-auto max-w-md mt-12 px-4 lg:px-8 text-center">
      <h2 className="text-green-600 text-2xl font-bold">
        Email Verification Successful
      </h2>
      <p className="text-gray-700 my-4">
        Your email has been successfully verified.
      </p>
      <Link
        href="/signin"
        className="flex justify-center items-center group p-2 text-blue-600"
      >
        <Icons.arrowLeft className="size-4 inline-block mr-2 text-muted-foreground transform transition-transform group-hover:-translate-x-1 group-hover:text-blue-600" />
        Sign In
      </Link>
    </div>
  );
}
