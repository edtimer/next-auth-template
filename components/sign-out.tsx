"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { handleSignOut } from "@/app/signin-actions";
import { Icons } from "@/components/icons";

export function SignOut() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      await handleSignOut();
    } catch (error) {
      // Implement React Hot Toast
      console.error("Unable to sign out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      disabled={isLoading}
      variant="ghost"
      size="sm"
      onClick={handleClick}
    >
      {isLoading ? (
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
  );
}
