import { JWT } from "next-auth/jwt";
import { User } from "next-auth";
import { getUserRole } from "@/lib/get-user-role";

export async function handleAuthJwt({
  token,
  user,
}: {
  token: JWT;
  user: User | undefined;
}) {
  if (user) {
    const response = await getUserRole(user);
    if (response.success) {
      token.role = response.role!;
    }
  }

  return token;
}
