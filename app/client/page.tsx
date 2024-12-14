"use client";

import { Icons } from "@/components/icons";
import { useCurrentSession } from "@/hooks/use-current-session";

export default function ClientPage() {
  const { session, status } = useCurrentSession();

  if (status === "loading") {
    return (
      <div className="w-fit mx-auto mt-12 flex items-center gap-2 text-center">
        <Icons.loader className="inline-block size-3.5 animate-spin" />
        <p className="text-gray-700">Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="mt-12 text-center">
        <p className="text-sm">User email: Not available</p>
        <p className="text-sm">User role: Not available</p>
        <p className="mt-4 text-gray-700 font-medium">
          This is a Client Component.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-12 text-center">
      <p className="text-sm">{session?.user.email}</p>
      <p className="text-sm">{session?.user.role}</p>
      <p className="mt-4 text-gray-700 font-medium">
        This is a Client Component.
      </p>
    </div>
  );
}
