import bcrypt from "bcrypt";
import { randomBytes } from "node:crypto";
import { getUser } from "@/lib/get-user";
import { createUser } from "@/lib/create-user";
import { sendCredentialEmailVerificationEmail } from "@/lib/send-credentials-email-verification-email";
import { checkCredentialsEmailVerificationStatus } from "@/lib/check-credentials-email-verification-status";

import { User } from "next-auth";

export async function authorizeCredentials(
  credentials: Partial<Record<string, unknown>>
): Promise<User | null> {
  try {
    const email = credentials.email as string;
    const password = credentials.password as string;

    // Try to find an existing user
    const user = await getUser(email);

    const verificationToken = randomBytes(32).toString("hex");

    // Handle new user signup flow
    if (!user) {
      const [userCreationStatus, emailSendingStatus] = await Promise.all([
        createUser(email, password, verificationToken),
        sendCredentialEmailVerificationEmail(email, verificationToken),
      ]);

      if (userCreationStatus.success && emailSendingStatus.success) {
        throw new Error("Verification pending");
      }
    }

    // Verify password
    const passwordsMatch = await bcrypt.compare(password, user!.password!);

    if (!passwordsMatch) {
      throw new Error("Invalid email or password");
    }

    // Check email verification
    const verificationStatus =
      await checkCredentialsEmailVerificationStatus(email);

    if (!verificationStatus.verified) {
      await sendCredentialEmailVerificationEmail(email, verificationToken);
      throw new Error("Verification pending");
    }

    return {
      email: user?.email,
      role: user?.role,
    } as User;
  } catch (error) {
    console.error("Authorization error:", error);
    // Return null to indicate failed authentication
    return null;
  }
}
