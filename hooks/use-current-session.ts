import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { useState, useEffect } from "react";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export function useCurrentSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    async function retrieveSession() {
      try {
        const sessionData = await getSession();
        if (sessionData) {
          setSession(sessionData);
          setStatus("authenticated");
          return;
        }
      } catch (error) {
        setSession(null);
        setStatus("unauthenticated");
      }
    }

    retrieveSession();
  }, []);

  return { session, status };
}
