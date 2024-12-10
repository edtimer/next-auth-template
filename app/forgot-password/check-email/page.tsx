import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <div className="text-center max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mt-12 mb-6">Check Your Email</h1>
      <p className="text-gray-700 leading-relaxed">
        If an account exists with the provided email address, we've sent a
        password reset link. The link will expire in 24 hours.
      </p>
      <p className="text-pretty text-gray-700 my-4 text-sm">
        Didn't receive the email? Check your spam or junk folder.
      </p>
      <Link href="/signin" className="mt-6">
        Back to Forgot password
      </Link>
    </div>
  );
}
