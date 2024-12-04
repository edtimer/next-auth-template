import { auth } from "@/auth";
import React from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";
import { SignOutButton } from "@/components/signout-button";

export async function UserAccountNav() {
  const session = await auth();

  if (!session) {
    return (
      <Link
        href="/login"
        className="rounded-full border border-sky-600 px-3 py-1.5 text-sm font-semibold text-sky-600 hover:bg-sky-600 hover:text-accent"
      >
        Log in
      </Link>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-1">
        <span className="inline-block h-8 w-8 overflow-hidden rounded-full border border-zinc-500 bg-zinc-500">
          <svg
            fill="currentColor"
            viewBox="0 0 24 24"
            className="h-full w-full text-zinc-700"
          >
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </span>
        <Icons.chevronDown className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {session!.user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {session!.user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
