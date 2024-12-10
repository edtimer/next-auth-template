import { ResetPasswordForm } from "@/components/reset-passsword-form";

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="mx-auto max-w-sm mt-12 text-center">
      <h2 className="text-red-600 text-2xl font-bold mb-4">
        Token Verification Error
      </h2>
      <p className="text-gray-600">{message}</p>
    </div>
  );
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const resetToken = (await searchParams).token;

  if (!resetToken) {
    return <ErrorMessage message="Token not found." />;
  }

  // First handle the case where no token is found and show an error UI

  // If token exists, then check if the token exists in the reset_tokens table
  // If token does not exist, show an error ui

  // Token exists but expired
  // Show an error UI

  //At this step, we have verified that the URL contains a valid token, so we render reset password form
  return <ResetPasswordForm />;
}
