"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "@conform-to/react";
import { useSearchParams } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { useActionState } from "react";
import { resetPassword } from "@/app/password-reset-actions";
import { resetPasswordSchema } from "@/app/schema";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.token;

  // Bind the email and token to the action
  const boundResetPassword = resetPassword.bind(null, token);
  const [lastResult, action, isPending] = useActionState(
    boundResetPassword,
    undefined
  );

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: resetPasswordSchema });
    },
  });

  return (
    <div className="px-6 py-16 lg:px-8 mx-auto max-w-sm">
      <h1 className="text-2xl font-bold text-center mb-6">Reset Password</h1>
      <form
        id={form.id}
        onSubmit={form.onSubmit}
        action={action}
        className="space-y-6"
        noValidate
      >
        {form.errors && (
          <div className="text-sm text-red-600 text-center">{form.errors}</div>
        )}

        <div>
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            type="password"
            name={fields.password.name}
            defaultValue={fields.password.initialValue}
            className="mt-2"
          />
          {fields.password.errors && (
            <div className="text-sm text-red-600 mt-1">
              {fields.password.errors}
            </div>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Resetting..." : "Reset password"}
        </Button>
      </form>
    </div>
  );
}
