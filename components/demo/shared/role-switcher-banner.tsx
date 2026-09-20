"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { DEMO_ROLES } from "./roles";

export default function RoleSwitcherBanner() {
  const pathname = usePathname();

  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-4 border-b bg-muted/50 px-4 py-2 text-sm">
      <span className="text-muted-foreground">Viewing as:</span>
      <div className="flex items-center gap-1">
        {DEMO_ROLES.map((role) => {
          const isActive = pathname === role.href;
          return (
            <Link
              key={role.slug}
              href={role.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "rounded-full px-3 py-1 font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-background hover:text-foreground"
              )}
            >
              {role.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
