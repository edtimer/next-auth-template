import React from "react";
import Link from "next/link";

import { Icons } from "@/components/icons";
import { NavItem } from "@/components/nav-item";
import { UserAccountNav } from "@/components/user-account-nav";

export function MainNav({ items }) {
  return (
    <div className="flex h-14 items-center justify-between px-4 shadow-md">
      <div className="flex items-center space-x-2">
        <Link href="/" className="text-lg font-black text-primary">
          NextAuth
        </Link>
      </div>
      {items?.length ? (
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            {items.map((item) => (
              <li key={item.title}>
                <NavItem title={item.title} href={item.href} />
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
      <UserAccountNav />
    </div>
  );
}
