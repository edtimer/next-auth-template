import { auth } from "@/auth";

export default async function ServerPage() {
  const session = await auth();

  if (!session) {
    return (
      <div className="mt-12 text-center">
        <p className="text-sm font-medium text-red-600">
          User Not Authenticated.
        </p>
        <p className="text-sm mt-4">User email: Not available</p>
        <p className="text-sm">User role: Not available</p>
        <p className="mt-4 text-gray-700 font-medium">
          This is a Server Component.
        </p>
      </div>
    );
  }
  return (
    <div className="mt-12 text-center">
      <p className="text-sm font-medium text-green-600">User Authenticated</p>
      <p className="text-sm mt-4">User email: {session.user.email}</p>
      <p className="text-sm">User role: {session.user.role}</p>
      <p className="mt-4 text-gray-700 font-medium">
        This is a Server Component.
      </p>
    </div>
  );
}
