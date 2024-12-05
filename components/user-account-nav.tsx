import React from "react";
import { getCurrentUser } from "@/lib/dal";
import { buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton } from "@/components/sign-out-button";

export async function UserAccountNav() {
  const user = await getCurrentUser();

  function getAvatarFallback(email: string) {
    return email?.slice(0, 2).toUpperCase();
  }

  if (!user) {
    return (
      <Link
        href="/signin"
        className={buttonVariants({
          size: "sm",
        })}
      >
        Sign in
      </Link>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user.image!} />
          <AvatarFallback>{getAvatarFallback(user.email!)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="cursor-pointer">
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
