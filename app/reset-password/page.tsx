import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/reset-passsword-form";

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
