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
        "relative text-sm font-medium text-zinc-400 transition-colors hover:text-accent",
        isActive && "text-accent"
      )}
      href={href}
    >
      {title}
      {isActive && (
        <motion.div
          className="-bottom-[19px] absolute inset-x-0 h-[2px] w-full rounded-full bg-orange-500"
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
