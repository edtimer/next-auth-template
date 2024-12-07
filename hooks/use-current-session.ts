import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { useState, useEffect } from "react";

export function useCurrentSession() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    async function retrieveSession() {
      try {
        const sessionData = await getSession();
        if (sessionData) {
          setSession(sessionData);
          return;
        }
      } catch (error) {
        setSession(null);
      }
    }

    retrieveSession();
  }, []);

  return { session };
}
