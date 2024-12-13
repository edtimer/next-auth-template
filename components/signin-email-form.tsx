"use client";

import { useActionState } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithEmail } from "@/app/signin-actions";
import { signInWithEmailSchema } from "@/app/schema";

export function SignInEmailForm({ from }: { from: string }) {
  // Bind the redirect URL to the action
  const boundSignInWithEmail = signInWithEmail.bind(null, from);

  const [lastResult, formAction, isPending] = useActionState(
    boundSignInWithEmail,
    undefined
  );

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: signInWithEmailSchema });
    },
  });

  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      action={formAction}
      className="grid gap-4"
      noValidate
    >
      {form.errors && (
        <div className="text-center text-sm text-red-600">{form.errors}</div>
      )}
      <div className="grid gap-2">
        <Label htmlFor="email" className="text-gray-700">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          name={fields.email.name}
          defaultValue={lastResult?.initialValue?.email as string}
          placeholder="you@example.com"
        />
        <div className="text-sm text-red-600">{fields.email.errors}</div>
      </div>
      <Button disabled={isPending}>
        {isPending ? (
          <>
            <Icons.loader className="size-3 animate-spin" />
            Sending link...
          </>
        ) : (
          "Send sign in link"
        )}
      </Button>
    </form>
  );
}
