import bcrypt from "bcrypt";
import { randomBytes } from "node:crypto";
import { getUser } from "@/lib/get-user";
import { createUser } from "@/lib/create-user";
import { sendCredentialEmailVerificationEmail } from "@/lib/send-credentials-email-verification-email";
import { checkCredentialsEmailVerificationStatus } from "@/lib/check-credentials-email-verification-status";

type Credentials = {
  email: string;
  password: string;
};

export async function authorizeCredentials(credentials: Credentials) {
  const email = credentials.email;
  const password = credentials.password;

  // Try to find an existing user
  const user = await getUser(email);

  const verificationToken = randomBytes(32).toString("hex");

  // Handle new user signup flow
  if (!user) {
    // Create user and send verification email concurrently
    const [userCreationStatus, emailSendingStatus] = await Promise.all([
      createUser(email, password, verificationToken),
      sendCredentialEmailVerificationEmail(email, verificationToken),
    ]);

    // If both operations succeeded, indicate verification is needed
    if (userCreationStatus.success && emailSendingStatus.success) {
      throw new Error("Verification pending");
    }
  }

  // At this point we know the user exists, verify the password
  const passwordsMatch = await bcrypt.compare(password, user!.password!);

  if (!passwordsMatch) {
    throw new Error("Invalid email or password");
  }

  // Check if the email has been verified
  const verificationStatus =
    await checkCredentialsEmailVerificationStatus(email);

  if (!verificationStatus.verified) {
    await sendCredentialEmailVerificationEmail(email, verificationToken);
    throw new Error("Verification pending");
  }

  // All checks passed - return the authenticated user
  return user;
}
