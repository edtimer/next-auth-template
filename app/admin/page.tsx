import { auth } from "@/auth";
import { getUserRole } from "@/lib/get-user-role";

export default async function AdminPage() {
  const session = await auth();

  const { role } = await getUserRole(session!.user);

  if (role === "user") {
    return (
      <div className="ma-auto max-w-lg mt-12 text-center">
        <p className="font-medium text-red-600">Admin Access Only</p>
        <p className="mt-4 text-gray-700 font-medium text-pretty">
          This page is only accessible to authenticated users having
          &quot;admin&quot; status.
        </p>
      </div>
    );
  }

  return (
    <p className="mt-12 text-center font-medium text-green-600">
      Welcome Admin
    </p>
  );
}
