import Link from "next/link";
import { Icons } from "@/components/icons";

export default function EmailSentPage() {
  return (
    <div className="mx-auto max-w-md mt-12 px-4 lg:px-8 text-center">
      <h1 className="text-2xl font-bold mt-12 text-green-600">Check Inbox</h1>
      <p className="text-gray-700 leading-relaxed text-pretty mt-2">
        I've sent a subscription email. Click the link in the email to
        subscribe.
      </p>
      <p className="text-pretty text-muted-foreground mt-4 text-sm">
        Didn't receive the email? Check your spam or junk folder.
      </p>
      <Link
        href="/"
        className="flex justify-center items-center group p-2 text-blue-600 mt-4"
      >
        <Icons.arrowLeft className="size-4 inline-block mr-2 text-muted-foreground transform transition-transform group-hover:-translate-x-1 group-hover:text-blue-600" />
        Home
      </Link>
    </div>
  );
}
