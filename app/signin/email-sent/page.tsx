import Link from "next/link";
import { Icons } from "@/components/icons";

export default function EmailSentPage() {
  return (
    <div className="text-center max-w-md mx-auto px-4 lg:px-8">
      <h1 className="text-2xl font-bold mt-12 text-green-600">Check Inbox</h1>
      <p className="text-gray-700 leading-relaxed mt-4">
        We&apos;ve sent a sign in link to your email address.
      </p>
      <p className="text-pretty text-muted-foreground mt-4 text-sm">
        Didn&apos;t receive the email? Check your spam or junk folder.
      </p>
      <Link
        href="/signin"
        className="flex justify-center items-center group p-2 text-blue-600 mt-4"
      >
        <Icons.arrowLeft className="size-4 inline-block mr-2 text-muted-foreground transform transition-transform group-hover:-translate-x-1 group-hover:text-blue-600" />
        Sign In
      </Link>
    </div>
  );
}
