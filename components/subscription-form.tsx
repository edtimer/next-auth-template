"use client";

import { useActionState } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { subscribe } from "@/lib/subscribe-actions";
import { subscribeSchema } from "@/app/schema";

export function SubscriptionForm() {
  const [lastResult, formAction, isPending] = useActionState(
    subscribe,
    undefined
  );

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: subscribeSchema });
    },
  });

  return (
    <div className="border rounded-lg bg-gray-100 p-4 lg:p-8 mt-6 mb-12">
      <h1 className="text-2xl font-bold text-center">Subscribe</h1>
      <p className="text-center mt-2 font-medium text-gray-500">
        Be first to know when the course launches.
      </p>
      <form
        id={form.id}
        onSubmit={form.onSubmit}
        action={formAction}
        className="grid gap-4 mt-4"
      >
        {form.errors && (
          <div className="text-center text-sm text-red-600">{form.errors}</div>
        )}
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-gray-700">
            Email
          </Label>
          <div className="relative">
            <Input
              required
              id="email"
              type="email"
              name={fields.email.name}
              defaultValue={lastResult?.initialValue?.email as string}
              placeholder="you@example.com"
            />
            <Button
              disabled={isPending}
              className="absolute top-0 bottom-0 right-1 h-8 m-auto"
            >
              {isPending ? (
                <>
                  <Icons.loader className="size-3 animate-spin" />
                  Subscribing...
                </>
              ) : (
                "Subscribe"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
