import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PasswordResetSuccessPage() {
  return (
    <div className="container max-w-lg py-16 text-center">
      <h1 className="text-2xl font-bold mb-4">Password Reset Complete</h1>
      <p className="text-muted-foreground mb-6">
        Your password has been successfully updated. You can now sign in with
        your new password.
      </p>
      <Button asChild>
        <Link href="/signin">Sign in</Link>
      </Button>
    </div>
  );
}
