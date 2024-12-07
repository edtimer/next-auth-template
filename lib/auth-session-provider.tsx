"use client";

import * as React from "react";
import { Session } from "next-auth";
import { useCallback, useEffect, useState } from "react";
import { SessionProvider, getSession } from "next-auth/react";

type NextAuthProviderProps = {
  children: React.ReactNode;
};

export function AuthSessionProvider({ children }: NextAuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);

  const fetchSession = useCallback(async () => {
    const session = await getSession();
    setSession(session);
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
