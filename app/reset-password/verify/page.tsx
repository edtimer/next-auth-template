import { Icons } from "@/components/icons";
import Link from "next/link";

// Define verification status type
type TokenVerificationStatus =
  | "token-invalid"
  | "token-expired"
  | "internal-error";

// Define the structure for error content
type ErrorContent = {
  title: string;
  message: string;
};

// Map each status to its corresponding title and message
const statusContent: Record<TokenVerificationStatus, ErrorContent> = {
  "token-invalid": {
    title: "Token is Invalid",
    message: "Please issue a new one.",
  },
  "token-expired": {
    title: "Token is Expired",
    message: "Please issue a new one.",
  },
  "internal-error": {
    title: "Something Went Wrong",
    message: "Please try again.",
  },
};

// Create reusable error message component
function ErrorMessage({ error }: { error: TokenVerificationStatus }) {
  const content = statusContent[error];

  return (
    <div className="mx-auto max-w-sm mt-12 px-4 lg:px-8 text-center">
      <h2 className="text-red-600 text-2xl font-bold">{content.title}</h2>
      <p className="text-gray-700 my-4">{content.message}</p>
      <Link
        href="/forgot-password"
        className="flex justify-center items-center group p-2"
      >
        <Icons.arrowLeft className="size-4 inline-block mr-2 text-muted-foreground transform transition-transform group-hover:-translate-x-1 group-hover:text-primary" />
        Request new reset link
      </Link>
    </div>
  );
}

export default function VerifyResetPasswordPage({
  searchParams,
}: {
  searchParams: { error?: TokenVerificationStatus };
}) {
  const errorType = searchParams.error || "internal-error";

  return <ErrorMessage error={errorType} />;
}
