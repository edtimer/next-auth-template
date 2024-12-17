"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";

import { signInWithGoogle } from "@/app/signin-actions";
import { Icons } from "@/components/icons";

export function SignInGoogleForm({ from }: { from: string }) {
  const boundGoogleSignIn = signInWithGoogle.bind(null, from);

  const [googleResult, googleAction, isGooglePending] = useActionState(
    boundGoogleSignIn,
    undefined
  );

  return (
    <form action={googleAction}>
      <button
        type="submit"
        className="w-full py-2 text-sm font-medium rounded-md shadow-sm border border-gray-300 text-gray-700 hover:bg-gray-100"
      >
        {isGooglePending ? (
          <>
            <Icons.loader className="mr-2 inline-block size-4 animate-spin" />
          </>
        ) : (
          <Icons.google className="inline-block mr-2 size-5" />
        )}
        Sign in with Google
      </button>
    </form>
  );
}
