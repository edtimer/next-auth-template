import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

export async function handleAuthSession({
  session,
  token,
}: {
  session: Session;
  token: JWT;
}) {
  if (session.user) {
    session.user.role = token.role;
  }
  return session;
}
