import { auth } from "@/auth";
import { getUserRole } from "@/lib/get-user-role";

export default async function AdminPage() {
  const session = await auth();

  const { role } = await getUserRole(session!.user);

  if (role === "user") {
    return (
      <div className="mt-12 mx-auto max-w-md text-center">
        <p className="text-2xl font-semibold text-gray-700">
          User Email: {session?.user.email}
        </p>
        <p className="text-2xl font-semibold text-gray-700 mt-2">
          User Role: {session?.user.role}
        </p>
        <p className="mt-4 text-gray-700">
          (This page is only accessible to user with &quot;admin&quot; status.)
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 mt-12 mx-auto max-w-lg text-center">
      <p className="font-semibold text-gray-700">
        User email: {session?.user.email}
      </p>
      <p className="font-semibold text-gray-700 mt-2">
        User role: {session?.user.role}
      </p>
      <p className="mt-4 text-gray-500 text-center text-pretty">
        This page is only accessible to user with &quot;admin&quot; status.
      </p>
    </div>
  );
}
