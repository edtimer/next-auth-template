import { Icons } from "@/components/icons";
import Link from "next/link";

type TokenVerificationStatus =
  | "token-invalid"
  | "token-expired"
  | "internal-error";

type ErrorContent = {
  title: string;
  message: string;
};

const defaultErrorContent: ErrorContent = {
  title: "Something Went Wrong",
  message: "Please try again.",
};

const statusContent: Record<TokenVerificationStatus, ErrorContent> = {
  "token-invalid": {
    title: "Invalid Token",
    message: "Please request a new one.",
  },
  "token-expired": {
    title: "Invalid Token",
    message: "Please request a new one.",
  },
  "internal-error": {
    title: "Something Went Wrong",
    message: "Please try again.",
  },
};

function isValidErrorType(error: string): error is TokenVerificationStatus {
  return error in statusContent;
}

function ErrorMessage({ error }: { error: string }) {
  const content = isValidErrorType(error)
    ? statusContent[error]
    : defaultErrorContent;

  return (
    <div className="mx-auto max-w-sm mt-12 px-4 lg:px-8 text-center">
      <h2 className="text-red-600 text-2xl font-bold">{content.title}</h2>
      <p className="text-gray-700 my-4">{content.message}</p>
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

export default async function CredentialsEmailVerificationStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const errorType = (await searchParams).error;

  if (errorType) {
    return <ErrorMessage error={errorType} />;
  }

  return (
    <div className="mx-auto max-w-sm mt-12 px-4 lg:px-8 text-center">
      <h2 className="text-red-600 text-2xl font-bold">Email Verified</h2>
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
