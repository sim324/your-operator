"use client";

import {
  CalendarIcon,
  ClipboardListIcon,
  FilterIcon,
  Gamepad2Icon,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  MessageSquareIcon,
  SendIcon,
  StarIcon,
  TrophyIcon,
  UsersIcon,
  VideoIcon,
  ZapIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { NavMain, type NavItem } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import { DEFAULT_DEMO_ROLE, DEMO_ROLES, type DemoRole } from "./roles";

// Stub navigation per role. Only each role's home item has a real page for
// now; the rest point at "#" until those pages exist.
const NAV_BY_ROLE: Record<DemoRole, NavItem[]> = {
  rep: [
    { title: "Dashboard", url: "/demo/rep", icon: <LayoutDashboardIcon /> },
    { title: "Meetings", url: "#", icon: <VideoIcon /> },
    { title: "Prospects", url: "#", icon: <UsersIcon /> },
    { title: "Coaching & games", url: "#", icon: <Gamepad2Icon /> },
  ],
  manager: [
    {
      title: "Team overview",
      url: "/demo/manager",
      icon: <LayoutDashboardIcon />,
    },
    { title: "Game results", url: "#", icon: <TrophyIcon /> },
    { title: "Intake funnel", url: "#", icon: <FilterIcon /> },
    { title: "Reviews", url: "#", icon: <StarIcon /> },
  ],
  prospect: [
    { title: "Intake", url: "/demo/prospect", icon: <MessageSquareIcon /> },
    { title: "Booking", url: "#", icon: <CalendarIcon /> },
    { title: "Client portal", url: "#", icon: <ClipboardListIcon /> },
  ],
};

const NAV_SECONDARY: NavItem[] = [
  { title: "Support", url: "#", icon: <LifeBuoyIcon /> },
  { title: "Feedback", url: "#", icon: <SendIcon /> },
];

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
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={role.href}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <ZapIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Your Operator</span>
                  <span className="truncate text-xs">{role.label} demo</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={NAV_BY_ROLE[role.slug]} />
        <NavSecondary items={NAV_SECONDARY} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={DEMO_USER} />
      </SidebarFooter>
    </Sidebar>
  );
}
