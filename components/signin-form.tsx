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
  const [lastResult, action] = useActionState(signin, undefined);

  const [form, fields] = useForm({
    // Sync the result of the last submission
    lastResult,

    //Reuse the validation logic on the client
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: signinSchema });
    },
  });
  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
      <div className="grid gap-6">
        <div className="grid gap-1">
          <Label>Email</Label>
          <Input type="email" name={fields.email.name} />
          <div>{fields.email.errors}</div>
        </div>
        <div className="grid gap-1">
          <Label>Password</Label>
          <Input type="password" name={fields.password.name} />
          <div>{fields.password.errors}</div>
        </div>
        <Button>Sign in</Button>
      </div>
    </form>
  );
}
