import { auth } from "@/auth";
import { SignOutButton } from "@/components/sign-out-button";

export default async function Home() {
  const session = await auth();

  return (
    <>
      <h1 className="text-2xl">Hello World!</h1>
      {session?.user && <SignOutButton />}
    </>
  );
}
