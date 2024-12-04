"use client";

import { Button } from "@/components/ui/button";
import { handleSignOut } from "@/app/actions";
import { useActionState } from "react";

export function SignOutButton() {
  // Use useActionState to handle the action state
  const [state, action, isPending] = useActionState(handleSignOut, undefined);

  return (
    <form action={action}>
      <Button variant="outline" disabled={isPending}>
        {isPending ? "Signing out..." : "Sign out"}
      </Button>
    </form>
  );
}
