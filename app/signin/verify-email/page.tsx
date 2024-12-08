export default function VerifyEmailPage() {
  return (
    <div className="text-center max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Verify Your Email</h1>
      <p className="text-gray-700 leading-relaxed">
        We've sent an email verification link to your email address. Please
        click the verification link in the email. The link will expire in 24
        hours.
      </p>
      <p className="text-gray-700 mt-4 text-sm">
        Can't find the email? Be sure to check your spam or junk folder.
      </p>
    </div>
  );
}
