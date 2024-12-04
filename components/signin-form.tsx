"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { signin, signInWithGoogle } from "@/app/actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { signInSchema } from "@/app/schema";
import { Icons } from "@/components/icons";

export function SigninForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // Create a new action function with callbackUrl bound as the first parameter
  const boundGoogleSignIn = signInWithGoogle.bind(null, callbackUrl);

  const [lastResult, formAction, isPending] = useActionState(signin, undefined);
  const [googleResult, googleAction, isGooglePending] = useActionState(
    boundGoogleSignIn,
    undefined
  );

  const [form, fields] = useForm({
    // Sync the result of the last submission
    lastResult,

    //Reuse the validation logic on the client
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: signInSchema });
    },
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  function togglePasswordVisibility() {
    setIsPasswordVisible((prevState) => !prevState);
  }
  return (
    <div className="px-6 py-16 lg:px-8">
      <h2 className="text-center text-2xl font-bold tracking-tight text-primary">
        Sign in to your account
      </h2>
      <div className="grid gap-6 mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form action={googleAction}>
          <Button
            type="submit"
            className="w-full shadow-sm border-gray-300 text-gray-900"
            variant="outline"
          >
            <Icons.google className="mr-2 size-6" />
            Sign in with Google
          </Button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase text-muted-foreground">
            <span className="bg-background px-2">Or</span>
          </div>
        </div>
        <form
          id={form.id}
          onSubmit={form.onSubmit}
          action={formAction}
          noValidate
        >
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" name={fields.email.name} />
              <div className="text-sm text-red-600">{fields.email.errors}</div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={isPasswordVisible ? "text" : "password"}
                  name={fields.password.name}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  aria-label={
                    isPasswordVisible ? "Hide password" : "Show password"
                  }
                  aria-pressed={isPasswordVisible}
                  className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground outline-offset-0 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPasswordVisible ? (
                    <Icons.eyeOff
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  ) : (
                    <Icons.eye size={16} strokeWidth={2} aria-hidden="true" />
                  )}
                </button>
              </div>
              <div className="text-sm text-red-500">
                {fields.password.errors}
              </div>
            </div>
            <Button disabled={isPending}>
              {isPending ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
