import Link from "next/link";
import { Icons } from "@/components/icons";

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  function getErrorMessage(error: string | undefined) {
    switch (error) {
      case "Verification":
        return "The sign in link has expired. Please request a new one.";
      case "Default":
      default:
        return "An error occurred during authentication. Please try again.";
    }
  }
  const errorMessage = getErrorMessage(params.error);

  return (
    <div
      className="mx-auto max-w-lg mt-12 text-center px-4
    "
    >
      <h1 className="text-xl font-bold text-red-600">Authentication Error</h1>
      <p className="text-gray-700 mt-4 text-pretty">{errorMessage}</p>
      <Link
        href="/signin"
        className="flex justify-center items-center group p-2 text-blue-600 mt-4"
      >
        <Icons.arrowLeft className="size-4 inline-block mr-2 text-muted-foreground transform transition-transform group-hover:-translate-x-1 group-hover:text-blue-600" />
        Sign in
      </Link>
    </div>
  );
}
