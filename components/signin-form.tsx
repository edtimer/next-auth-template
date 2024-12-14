"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

import { signInWithGoogle } from "@/app/signin-actions";
import { Icons } from "@/components/icons";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignInEmailForm } from "@/components/signin-email-form";
import { SignInEmailPasswordForm } from "@/components/signin-email-password-form";

export function SigninForm() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";

  const boundGoogleSignIn = signInWithGoogle.bind(null, from);

  const [googleResult, googleAction, isGooglePending] = useActionState(
    boundGoogleSignIn,
    undefined
  );

  return (
    <div className="mt-16 sm:mx-auto sm:max-w-sm px-4">
      <h2 className="text-center text-2xl font-bold tracking-tight text-primary">
        Sign in to your account
      </h2>
      <div className="grid gap-4 mt-10">
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
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-sm text-muted-foreground">
            <span className="bg-background px-2">Or continue with</span>
          </div>
        </div>
        <Tabs defaultValue="email-link" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email-link">Email Link</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="email-link">
            <SignInEmailForm from={from} />
          </TabsContent>
          <TabsContent value="password">
            <SignInEmailPasswordForm from={from} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
