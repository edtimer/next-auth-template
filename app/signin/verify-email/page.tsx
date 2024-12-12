import Link from "next/link";
import { Icons } from "@/components/icons";
import EmailSentPage from "../email-sent/page";

export default function VerifyEmailPage() {
  return (
    <div className="text-center max-w-md mx-auto px-4 lg:px-8">
      <h1 className="text-2xl font-bold mt-12 mb-6">Verify Your Email</h1>
      <p className="text-gray-700 leading-relaxed">
        We've sent a verification link to your email.
      </p>
      <p className="text-pretty text-muted-foreground my-4 text-sm">
        Didn't receive the email? Check your spam or junk folder.
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
