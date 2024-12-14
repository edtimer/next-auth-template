import { auth } from "@/auth";

export default async function ProtectedPage() {
  const session = await auth();

  return (
    <div className="mt-12 text-center">
      <p className="font-medium text-green-600">User Authenticated</p>
      <p className="text-sm mt-4">User email: {session?.user.email}</p>
      <p className="text-sm">User role: {session?.user.role}</p>
      <p className="mt-4 text-gray-700 font-medium text-pretty">
        This is a private page, only accessible to authenticated users.
      </p>
    </div>
  );
}
