import { auth } from "@/auth";

export default async function ServerPage() {
  const session = await auth();

  if (!session) {
    return (
      <div className="mt-12 text-center">
        <p className="text-sm">User email: Not available</p>
        <p className="text-sm">User role: Not available</p>
        <p className="mt-4 text-gray-700 font-medium">
          This is a Server Component.
        </p>
      </div>
    );
  }
  return (
    <div className="mt-12 text-center">
      <p className="text-sm">{session.user.email}</p>
      <p className="text-sm">{session.user.role}</p>
      <p className="mt-4 text-gray-700 font-medium">
        This is a Server Component.
      </p>
    </div>
  );
}
