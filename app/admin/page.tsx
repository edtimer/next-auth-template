import { auth } from "@/auth";
import { getUserRole } from "@/lib/get-user-role";

export default async function AdminPage() {
  const session = await auth();

  const { role } = await getUserRole(session!.user);

  if (role === "user") {
    return (
      <p className="mt-12 text-center font-medium text-red-600">
        Admin Access Only
      </p>
    );
  }

  return (
    <p className="mt-12 text-center font-medium text-green-600">
      Welcome Admin
    </p>
  );
}
