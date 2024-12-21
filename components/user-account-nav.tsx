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
import { SignOut } from "@/components/sign-out";

export async function UserAccountNav() {
  const user = await getCurrentUser();

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
          <AvatarImage src={user.image || undefined} />
          <AvatarFallback>
            {user.email!.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="cursor-pointer">
          <SignOut />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
