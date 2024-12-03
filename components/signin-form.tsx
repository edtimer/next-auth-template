"use client";

import { useActionState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { signin } from "@/app/actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { signinSchema } from "@/app/schema";

export function SigninForm() {
  const [lastResult, formAction, isPending] = useActionState(signin, undefined);

  const [form, fields] = useForm({
    // Sync the result of the last submission
    lastResult,

    //Reuse the validation logic on the client
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: signinSchema });
    },
  });
  return (
    <form id={form.id} onSubmit={form.onSubmit} action={formAction} noValidate>
      <div className="grid gap-6">
        <div className="grid gap-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" name={fields.email.name} />
          <div className="text-sm text-red-600">{fields.email.errors}</div>
        </div>
        <div className="grid gap-1">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" name={fields.password.name} />
          <div className="text-sm text-red-600">{fields.password.errors}</div>
        </div>
        <Button disabled={isPending}>
          {isPending ? "Signing in..." : "Sign in"}
        </Button>
      </div>
    </form>
  );
}
