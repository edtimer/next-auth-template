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
  const token = searchParams.get("token");

  // Bind the token to the action
  const boundResetPassword = resetPassword.bind(null, token!);
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
    <div className="py-16 mx-auto sm:max-w-sm">
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

        <div className="grid gap-2">
          <Label htmlFor="newPassword">New password</Label>
          <Input id="newPassword" type="password" name="newPassword" />
          {fields.newPassword.errors && (
            <div className="text-sm text-red-600 mt-1">
              {fields.newPassword.errors}
            </div>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="newPassword">Confirm new password</Label>
          <Input
            id="confirmNewPassword"
            type="password"
            name="confirmNewPassword"
          />
          {fields.confirmNewPassword.errors && (
            <div className="text-sm text-red-600 mt-1">
              {fields.confirmNewPassword.errors}
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
