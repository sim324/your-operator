"use client";

import {
  LayoutDashboardIcon,
  MessageSquareIcon,
  RadarIcon,
  StarIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { ThemeButton } from "@/components/ui/theme-button";

import { NavMain, type NavItem } from "./nav-main";
import { NavUser } from "./nav-user";
import { DEFAULT_DEMO_ROLE, DEMO_ROLES, type DemoRole } from "./roles";

// Stub navigation per role. Only each role's home item has a real page for
// now; the rest point at "#" until those pages exist.
const NAV_BY_ROLE: Record<DemoRole, NavItem[]> = {
  leader: [
    {
      title: "Dashboard",
      url: "/demo/leader",
      icon: <LayoutDashboardIcon />,
    },
    { title: "Reviews", url: "/demo/leader/reviews", icon: <StarIcon /> },
    {
      title: "AI visibility",
      url: "/demo/leader/ai-visibility",
      icon: <RadarIcon />,
    },
  ],
  prospect: [
    { title: "Intake", url: "/demo/prospect", icon: <MessageSquareIcon /> },
  ],
};

const DEMO_USER = {
  name: "Demo User",
  email: "demo@youroperator.ai",
  avatar: "",
};

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const role =
    DEMO_ROLES.find((r) => pathname.startsWith(r.href)) ??
    DEMO_ROLES.find((r) => r.slug === DEFAULT_DEMO_ROLE)!;

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        {/* Not a link, so no hover state; the theme toggle is its only action. */}
        <Item variant="outline" size="sm">
          <ItemContent>
            <ItemTitle>Your Operator</ItemTitle>
          </ItemContent>
          <ItemActions>
            <ThemeButton variant="ghost" size="icon-sm" />
          </ItemActions>
        </Item>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={NAV_BY_ROLE[role.slug]} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={DEMO_USER} />
      </SidebarFooter>
    </Sidebar>
  );
}
