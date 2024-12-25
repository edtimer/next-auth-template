"use client";

import { useSearchParams } from "next/navigation";
import { SignInGoogleForm } from "@/components/signin-google-form";
import { SignInEmailForm } from "@/components/signin-email-form";
import { SignInEmailPasswordForm } from "@/components/signin-email-password-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SigninForm() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";

  return (
    <div className="mt-16 sm:mx-auto sm:max-w-sm px-4">
      <h2 className="text-center text-2xl font-bold tracking-tight text-primary">
        Sign in to your account
      </h2>
      <div className="grid gap-4 mt-10">
        <SignInGoogleForm from={from} />
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
            <SignInEmailForm />
          </TabsContent>
          <TabsContent value="password">
            <SignInEmailPasswordForm from={from} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
