"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState } from "react";
import { resetPassword } from "@/app/password-reset-actions";
import { z } from "zod";

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

interface Props {
  email: string;
  token: string;
}

export function ResetPasswordForm({ email, token }: Props) {
  // Bind the email and token to the action
  const boundResetPassword = resetPassword.bind(null, email, token);
  const [lastResult, action, isPending] = useActionState(
    boundResetPassword,
    undefined
  );

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: resetPasswordSchema });
    },
    shouldValidate: "onBlur",
  });

  return (
    <div>
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
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type="password"
            name={fields.password.name}
            key={fields.password.key}
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
          {isPending ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>
  );
}
