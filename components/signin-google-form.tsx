"use client";

import { useActionState } from "react";

import { signInWithGoogle } from "@/app/signin-actions";
import { Icons } from "@/components/icons";

export function SignInGoogleForm({ from }: { from: string }) {
  const boundGoogleSignIn = signInWithGoogle.bind(null, from);

  const [formState, formAction, isPending] = useActionState(
    boundGoogleSignIn,
    undefined
  );

  return (
    <form action={formAction} className="grid gap-2">
      {formState !== undefined && formState?.error && (
        <div className="text-center text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2 text-pretty">
          {formState?.message}
        </div>
      )}
      <button
        type="submit"
        className="w-full py-2 text-sm font-medium rounded-md shadow-sm border border-gray-300 text-gray-700 hover:bg-gray-100"
      >
        {isPending ? (
          <>
            <Icons.loader className="mr-2 inline-block size-3.5 animate-spin" />
          </>
        ) : (
          <Icons.google className="inline-block mr-2 size-5" />
        )}
        Sign in with Google
      </button>
    </form>
  );
}
