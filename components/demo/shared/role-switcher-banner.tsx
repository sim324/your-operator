"use client";

import { useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { clearLeadCompanyCookie } from "@/lib/intake/actions";
import { Button } from "@/components/ui/button";

import { DEMO_ROLES } from "./roles";

interface RoleSwitcherBannerProps {
  companyName?: string | null;
}

export default function RoleSwitcherBanner({
  companyName,
}: RoleSwitcherBannerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleStartOver() {
    startTransition(async () => {
      await clearLeadCompanyCookie();
      router.refresh();
    });
  }

  return (
    <div className="flex w-full h-11 items-center justify-start gap-2 border-b px-4 bg-muted">
      <span className="text-muted-foreground text-sm">Viewing as:</span>
      <div className="flex items-center">
        {DEMO_ROLES.map((role) => {
          const isActive = pathname === role.href;
          return (
            <Button
              key={role.slug}
              asChild
              size="sm"
              variant={isActive ? "outline" : "ghost"}
            >
              <Link
                href={role.href}
                aria-current={isActive ? "page" : undefined}
              >
                {role.label}
              </Link>
            </Button>
          );
        })}
      </div>

      {companyName && (
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Company: <span className="font-medium text-foreground">{companyName}</span>
          </span>
          <Button
            size="sm"
            variant="ghost"
            disabled={isPending}
            onClick={handleStartOver}
          >
            Start over
          </Button>
        </div>
      )}
    </div>
  );
}
