"use client";

import { Button } from "@/components/ui/button";
import { handleSignOut } from "@/app/signin-actions";
import { useActionState } from "react";
import { Icons } from "@/components/icons";

export function SignOutButton() {
  const [state, action, isPending] = useActionState(handleSignOut, undefined);

  return (
    <form action={action}>
      <Button disabled={isPending} variant="ghost" size="sm">
        {isPending ? (
          <>
            <Icons.loader className="size-3 animate-spin text-muted-foreground" />
            Sign out
          </>
        ) : (
          <>
            <Icons.logOut className="size-3 text-muted-foreground" />
            Sign out
          </>
        )}
      </Button>
    </form>
  );
}
