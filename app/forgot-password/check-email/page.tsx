import Link from "next/link";
import { Icons } from "@/components/icons";

export default function CheckEmailPage() {
  return (
    <div className="mx-auto max-w-md mt-12 px-4 lg:px-8 text-center">
      <h1 className="text-2xl font-bold mt-12 mb-6">Check Your Email</h1>
      <p className="text-gray-700 leading-relaxed text-pretty">
        If an account exists with the provided email address, we've sent a
        password reset link. The link will expire in 24 hours.
      </p>
      <p className="text-pretty text-muted-foreground my-4 text-sm">
        Didn't receive the email? Check your spam or junk folder.
      </p>
      <Link
        href="/forgot-password"
        className="flex justify-center items-center group p-2 text-blue-600"
      >
        <Icons.arrowLeft className="size-4 inline-block mr-2 text-muted-foreground transform transition-transform group-hover:-translate-x-1 group-hover:text-blue-600" />
        Forgot password
      </Link>
    </div>
  );
}
