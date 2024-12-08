import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="text-center max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mt-12 mb-6">Verify Your Email</h1>
      <p className="text-gray-700 leading-relaxed">
        We've sent a verification link to your email address. Click the link to
        verify your account. The link will expire in 24 hours.
      </p>
      <p className="text-pretty text-gray-700 my-4 text-sm">
        Didn't receive the email? Check your spam or junk folder.
      </p>
      <Link href="/signin" className="mt-6">
        Back to Sign in
      </Link>
    </div>
  );
}
