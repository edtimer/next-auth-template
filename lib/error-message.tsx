import Link from "next/link";
import { Icons } from "@/components/icons";
import { VerifyCredentialEmailError } from "@/lib/verify-credential-email-error";

export function ErrorMessage({
  code,
}: {
  code: keyof typeof VerifyCredentialEmailError.errorMessages;
}) {
  const message = VerifyCredentialEmailError.getErrorMessage(code);
  return (
    <div className="mx-auto max-w-sm mt-12 px-4 lg:px-8 text-center">
      <h2 className="text-red-600 text-2xl font-bold">
        Token Verification Error
      </h2>
      <p className="text-gray-700 my-4">{message}</p>
      <Link
        href="/signin"
        className="flex justify-center items-center group p-2"
      >
        <Icons.arrowLeft className="size-4 inline-block mr-2 text-muted-foreground transform transition-transform group-hover:-translate-x-1 group-hover:text-primary" />
        Sign In
      </Link>
    </div>
  );
}
