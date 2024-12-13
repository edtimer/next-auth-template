"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import Link from "next/link";
import { useState } from "react";
import { useActionState } from "react";
import { signInWithEmailAndPassword } from "@/app/signin-actions";
import { signInWithEmailAndPasswordSchema } from "@/app/schema";

export function SignInEmailPasswordForm({ from }: { from: string }) {
  const boundSignInWithEmailAndPassword = signInWithEmailAndPassword.bind(
    null,
    from
  );

  const [lastResult, formAction, isPending] = useActionState(
    boundSignInWithEmailAndPassword,
    undefined
  );

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: signInWithEmailAndPasswordSchema,
      });
    },
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  function togglePasswordVisibility() {
    setIsPasswordVisible((prevState) => !prevState);
  }

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={formAction} noValidate>
      <div className="grid gap-4">
        {form.errors && (
          <div className="text-sm text-red-600 text-center bg-red-50 border border-red-200 rounded p-2">
            {form.errors}
          </div>
        )}
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name={fields.email.name}
            defaultValue={lastResult?.initialValue?.email as string}
            placeholder="you@example.com"
          />
          <div className="text-sm text-red-600">{fields.email.errors}</div>
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot password?
              </Link>
            </div>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={isPasswordVisible ? "text" : "password"}
              name={fields.password.name}
              defaultValue={lastResult?.initialValue?.password as string}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
              aria-pressed={isPasswordVisible}
              className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground outline-offset-0 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPasswordVisible ? (
                <Icons.eyeOff size={16} strokeWidth={2} aria-hidden="true" />
              ) : (
                <Icons.eye size={16} strokeWidth={2} aria-hidden="true" />
              )}
            </button>
          </div>
          <div className="text-sm text-red-500">{fields.password.errors}</div>
        </div>
        <Button disabled={isPending}>
          {isPending ? "Signing in..." : "Sign in"}
        </Button>
      </div>
    </form>
  );
}
