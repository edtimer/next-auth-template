"use client";

import { useCurrentSession } from "@/hooks/use-current-session";

export default function ClientPage() {
  const { session, status } = useCurrentSession();

  if (status === "loading") {
    return <p className="text-center mt-12">Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p className="text-center mt-12">User is not authenticated.</p>;
  }

  return (
    <div className="mt-12">
      <p className="text-center">{session?.user?.email}</p>
      <p className="text-center mt-3">{session?.user?.role}</p>
    </div>
  );
}
