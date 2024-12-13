import { JWT } from "next-auth/jwt";
import { User } from "next-auth";

export async function handleAuthJwt({
  token,
  user,
}: {
  token: JWT;
  user: User | undefined;
}) {
  // When the user signs in, the user object will be available
  if (user) {
    token.role = user.role;
  }
  return token;
}
