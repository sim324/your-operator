"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

import { clearLeadCompanyCookie } from "@/lib/intake/actions";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const currentRole = DEMO_ROLES.find((role) => role.href === pathname);

  function handleRoleChange(slug: string) {
    const role = DEMO_ROLES.find((r) => r.slug === slug);
    if (role) router.push(role.href);
  }

  function handleStartOver() {
    startTransition(async () => {
      await clearLeadCompanyCookie();
      router.refresh();
    });
  }

  return (
    <div className="flex w-full h-11 items-center gap-2 border-b px-4 bg-muted">
      <span className="shrink-0 text-sm text-muted-foreground">
        Viewing as:
      </span>

      <Select value={currentRole?.slug} onValueChange={handleRoleChange}>
        <SelectTrigger size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {DEMO_ROLES.map((role) => (
            <SelectItem key={role.slug} value={role.slug}>
              {role.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {companyName && (
        <div className="ml-auto flex min-w-0 items-center gap-2">
          <span className="hidden shrink-0 text-sm text-muted-foreground sm:inline">
            Company:
          </span>
          <span className="min-w-0 max-w-32 truncate text-sm font-medium sm:max-w-48">
            {companyName}
          </span>
          <Button
            size="default"
            variant="destructive"
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
