"use client";

import type { ComponentProps } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeButton({
  variant = "outline",
  size = "icon-xl",
  ...props
}: ComponentProps<typeof Button>) {
  const { resolvedTheme, setTheme } = useTheme();
  // The large header button gets bigger icons; smaller sizes keep the
  // Button's default icon size.
  const iconSize = size === "icon-xl" ? "size-5" : undefined;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      {...props}
    >
      <Sun className={cn("block dark:hidden", iconSize)} />
      <Moon className={cn("hidden dark:block", iconSize)} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
