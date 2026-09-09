"use client";

import { AppIcon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BrandMark } from "./brand-mark";
import { SidebarNav } from "./sidebar-nav";
import { SidebarUserMenu } from "./sidebar-user-menu";
import { useSidebarCollapse } from "./sidebar-collapse-context";
import { cn } from "@/lib/utils";
import type { Person } from "@/lib/domain";

/**
 * Desktop navigation rail. Collapses to an icon-only rail (width 4.5rem) that
 * keeps active state and exposes tooltips for every item — see items #17-20.
 * Mobile uses its own Sheet-based drawer (mobile-nav.tsx) and never collapses.
 */
export function Sidebar({ operator }: { operator: Person | undefined }) {
  const { collapsed, toggle } = useSidebarCollapse();

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen flex-col border-e border-sidebar-border bg-sidebar p-3 transition-[width] duration-150 lg:flex",
        collapsed ? "w-[4.5rem] items-center px-2" : "w-64",
      )}
    >
      <div className={cn("mb-6 flex items-center gap-2", collapsed ? "flex-col" : "justify-between px-1")}>
        {collapsed ? (
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-2xs">
            <AppIcon name="verify" size={20} variant="Bold" />
          </span>
        ) : (
          <BrandMark />
        )}
      </div>

      <SidebarNav />

      <div className="mt-auto flex flex-col gap-2 pt-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={toggle}
              aria-label={collapsed ? "بازکردن نوار کناری" : "جمع‌کردن نوار کناری"}
              className={cn("text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", collapsed ? "mx-auto" : "self-end")}
            >
              <AppIcon name={collapsed ? "expandSidebar" : "collapseSidebar"} size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">{collapsed ? "بازکردن نوار کناری" : "جمع‌کردن نوار کناری"}</TooltipContent>
        </Tooltip>

        <div className="border-t border-sidebar-border pt-2">
          <SidebarUserMenu operator={operator} collapsed={collapsed} />
        </div>
      </div>
    </aside>
  );
}
