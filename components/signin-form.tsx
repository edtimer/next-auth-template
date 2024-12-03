import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SigninForm() {
  return (
    <form>
      <div className="grid gap-6">
        <div className="grid gap-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" />
        </div>
        <Button>Sign in</Button>
      </div>
    </form>
  );
}
