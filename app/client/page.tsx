"use client";

import { useCurrentSession } from "@/hooks/use-current-session";

export default function ClientPage() {
  const { session } = useCurrentSession();

  if (!session) {
    return <p>User not authenticated</p>;
  }

  return <p>{session.user?.email}</p>;
}
