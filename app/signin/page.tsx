import { Suspense } from "react";
import { SigninForm } from "@/components/signin-form";

export default function SigninPage() {
  return (
    <Suspense>
      <SigninForm />
    </Suspense>
  );
}
