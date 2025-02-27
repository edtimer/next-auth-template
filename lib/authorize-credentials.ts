import bcrypt from "bcrypt";
import { checkUserExists } from "@/lib/check-user-exists";
import { createUser } from "@/lib/create-user";
import { sendCredentialEmailVerificationEmail } from "@/lib/send-credentials-email-verification-email";
import { checkCredentialsEmailVerificationStatus } from "@/lib/check-credentials-email-verification-status";
import { AuthorizeCredentialsError } from "@/lib/authorize-credentials-error";
import { User } from "next-auth";

export async function authorizeCredentials(
  credentials: Partial<Record<string, unknown>>
): Promise<User | null> {
  const email = credentials.email as string;
  const password = credentials.password as string;

  // Try to find an existing user
  const user = await checkUserExists(email);

  const verificationToken = crypto.randomUUID();

  // Handle new user signup flow
  if (!user) {
    const [userCreationStatus, emailSendingStatus] = await Promise.all([
      createUser(email, password, verificationToken),
      sendCredentialEmailVerificationEmail(email, verificationToken),
    ]);

    if (userCreationStatus.success && emailSendingStatus.success) {
      throw new AuthorizeCredentialsError("EMAIL_SENT");
    }
  }

  // Verify password
  const passwordsMatch = await bcrypt.compare(password, user!.password!);

  if (!passwordsMatch) {
    throw new AuthorizeCredentialsError("INVALID_CREDENTIALS");
  }

  // Check email verification
  const verificationStatus =
    await checkCredentialsEmailVerificationStatus(email);

  if (!verificationStatus.verified) {
    await sendCredentialEmailVerificationEmail(email, verificationToken);
    throw new AuthorizeCredentialsError("EMAIL_SENT");
  }

  return {
    email: user?.email,
    role: user?.role,
  } as User;
}
