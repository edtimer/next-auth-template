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
    <div className="py-16 sm:mx-auto sm:max-w-sm">
      <h2 className="text-center text-2xl font-bold tracking-tight text-primary">
        Sign in to your account
      </h2>
      <div className="grid gap-4 mt-10">
        <form action={googleAction}>
          <Button
            type="submit"
            className="w-full shadow-sm border-gray-300 text-gray-900"
            variant="outline"
          >
            {isGooglePending ? (
              <>
                <Icons.loader className="size-3 animate-spin" />
              </>
            ) : (
              <Icons.google className="mr-2 size-6" />
            )}
            Sign in with Google
          </Button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-small text-muted-foreground">
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
