import { verifyCredentialsEmail } from "@/lib/verify-credentials-email";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  // First handle the case where no token is provided
  if (!searchParams.token) {
    return <h1>Verification Failed</h1>;
  }

  // Attempt to verify the email
  const verificationResult = await verifyCredentialsEmail(
    searchParams.token
  ).catch((error) => {
    // This will capture any errors thrown by verifyCredentialsEmail
    return {
      error: error instanceof Error ? error.message : "Verification failed",
    };
  });

  // If verification failed, show error UI
  if ("error" in verificationResult) {
    return <h1>Verification Failed</h1>;
  }

  // If we get here, verification was successful
  return <h1>Email Verified!</h1>;
}
