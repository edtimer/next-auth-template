"use client";

import { useCurrentSession } from "@/hooks/use-current-session";

export default function ClientPage() {
  const { session } = useCurrentSession();

  if (!session) {
    return <p>User not authenticated</p>;
  }

  return (
    <>
      <p className="text-center">{session.user?.email}</p>
      <p className="text-center mt-3">{session.user?.role}</p>
    </>
  );
}
