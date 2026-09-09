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
 * Desktop navigation rail — a white surface, same as the Top Bar, separated
 * from Main Content only by a subtle left border (`border-e`, which is the
 * left edge in this RTL shell). Selected nav uses a subtle Primary-tinted
 * background with Primary Blue text/icon; the brand mark is the shell's one
 * deliberate Primary Blue accent. Collapses to an icon-only rail that keeps
 * active state and exposes tooltips for every item. Mobile uses its own
 * Sheet-based drawer (mobile-nav.tsx) and never collapses.
 */
export function Sidebar({ operator }: { operator: Person | undefined }) {
  const { collapsed, toggle } = useSidebarCollapse();

  const toggleButton = (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggle}
          aria-label={collapsed ? "بازکردن نوار کناری" : "جمع‌کردن نوار کناری"}
          className="shrink-0 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-sidebar-ring focus-visible:ring-offset-sidebar"
        >
          <AppIcon name="sidebarToggle" size={20} />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left">{collapsed ? "بازکردن نوار کناری" : "جمع‌کردن نوار کناری"}</TooltipContent>
    </Tooltip>
  );

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen flex-col border-e border-sidebar-border bg-sidebar p-3 transition-[width] duration-150 lg:flex",
        collapsed ? "w-[4.5rem] items-center px-2" : "w-64",
      )}
    >
      {/* Header row: logo(+title) opposite the collapse control when expanded; logo above the expand control when collapsed — items #9-11. */}
      {collapsed ? (
        <div className="mb-6 flex flex-col items-center gap-3">
          <BrandMark iconOnly />
          {toggleButton}
        </div>
      ) : (
        <div className="mb-6 flex items-center justify-between gap-2 px-1">
          <BrandMark />
          {toggleButton}
        </div>
      )}

      <SidebarNav />

      <div className="mt-auto border-t border-sidebar-border pt-3">
        <SidebarUserMenu operator={operator} collapsed={collapsed} />
      </div>
    </aside>
  );
}
