import type { ReactNode } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";

/**
 * Demo app shell built on the shadcn inset sidebar block (sidebar-08).
 *
 * The sidebar is `position: fixed` by default, which would slide under the
 * role switcher banner above this shell. `transform-gpu` makes this wrapper
 * the containing block for that fixed sidebar, and `h-full` on the sidebar
 * sizes it to the wrapper instead of the whole viewport.
 */
export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-0 flex-1 transform-gpu">
        <AppSidebar className="h-full" />
        <SidebarInset className="overflow-y-auto">
          <AppHeader />
          <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
