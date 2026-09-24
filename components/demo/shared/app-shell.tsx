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
      <SidebarProvider
        defaultOpen={false}
        className="min-h-0 flex-1 transform-gpu"
      >
        <AppSidebar className="h-full" />
        {/* The header stays put and only the canvas below it scrolls. The
            scroll container is full width so its scrollbar sits at the
            window edge, not beside the centered max-w-7xl content.
            A page marked data-fill-height gets a fixed height on desktop
            instead, so it can scroll its own columns (reviews), and one
            marked data-full-width drops the max width (prospect preview). */}
        <SidebarInset className="min-h-0 overflow-hidden">
          <AppHeader />
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 p-4 lg:has-[[data-fill-height]]:min-h-0 has-[[data-full-width]]:max-w-none">
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
