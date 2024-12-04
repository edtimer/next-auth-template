"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

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
      {isActive && (
        <motion.div
          className="-bottom-[20px] absolute inset-x-0 h-[2px] w-full bg-blue-500"
          layoutId="underline"
          transition={{
            layout: {
              duration: 0.2,
              ease: "easeOut",
            },
          }}
        />
      )}
    </Link>
  );
}
