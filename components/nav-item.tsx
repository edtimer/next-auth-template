"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export function NavItem({ href, title }: { href: string; title: string }) {
  const pathname = usePathname();
  const isActive = href === pathname;

  return (
    <Link
      className={cn(
        "relative text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
        isActive && "text-primary"
      )}
      href={href}
    >
      {title}
    </Link>
  );
}
