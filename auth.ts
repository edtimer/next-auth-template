import bcrypt from "bcrypt";
import { randomBytes } from "node:crypto";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import { getUser } from "@/lib/get-user";
import { saveUser } from "@/lib/save-user";
import { sendCredentialEmailVerificationEmail } from "@/lib/send-credentials-email-verification-email";
import { checkCredentialsEmailVerificationStatus } from "@/lib/check-credentials-email-verification-status";
import { CustomEmailProvider } from "@/lib/custom-email-provider";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  debug: true,
  session: { strategy: "jwt" },
  // callbacks: {
  //   async redirect({ url, baseUrl }) {
  //     // If we see a URL that contains '/signin?from=', we want to extract
  //     // the actual destination from the 'from' parameter
  //     if (url.includes("/signin?from=")) {
  //       // Parse the URL to get the 'from' parameter
  //       const signinUrl = new URL(url);
  //       const destination = signinUrl.searchParams.get("from");

  //       if (destination) {
  //         // Decode the destination and make it absolute
  //         const decodedDestination = decodeURIComponent(destination);

  //         // If it's a relative URL, make it absolute
  //         if (decodedDestination.startsWith("/")) {
  //           const finalUrl = `${baseUrl}${decodedDestination}`;
  //           return finalUrl;
  //         }
  //       }
  //     }

  //     // For all other cases, use the default logic
  //     if (url.startsWith("/")) {
  //       return `${baseUrl}${url}`;
  //     }

  //     // If the URL is already absolute and matches our domain, use it
  //     if (url.startsWith(baseUrl)) {
  //       return url;
  //     }

  //     // Default to the base URL
  //     return baseUrl;
  //   },
  // },
  providers: [
    Google({ allowDangerousEmailAccountLinking: true }),
    CustomEmailProvider(),
    Credentials({
      authorize: async (credentials, req) => {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        const user = await getUser(email);

        // The user is not found, so the user is either signing in for the first time or has entered wrong email
        // We will assume that the user is signing in for the first time
        // We have no way to know if the user has entered the wrong email
        if (!user) {
          const verificationToken = randomBytes(32).toString("hex");
          // Create a new user
          // Send the user email verification email
          const [emailResult, newUser] = await Promise.all([
            sendCredentialEmailVerificationEmail(email, verificationToken),
            saveUser(email, password, verificationToken),
          ]);

          if (emailResult.success && newUser.success) {
            throw new Error("Verification pending");
          }
        }

        // At this step, the user exists, so need to check whether passwords match
        const passwordsMatch = await bcrypt.compare(password, user!.password!);

        if (!passwordsMatch) {
          throw new Error("Invalid email or password");
        }

        // Check email verification status
        const verificationStatus =
          await checkCredentialsEmailVerificationStatus(email);

        if (!verificationStatus.verified) {
          throw new Error("Verification pending");
        }

        // Email is verified and password matches - return user
        return user;
      },
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
});
