"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/icon";
import { SidebarNav } from "./sidebar-nav";
import { SidebarUserMenu } from "./sidebar-user-menu";
import { BrandMark } from "./brand-mark";
import type { Person } from "@/lib/domain";

/**
 * Mobile navigation drawer (shadcn Sheet) — independent of the desktop
 * collapse rail, always shows full labels plus identity/logout (item #21).
 */
export function MobileNav({ operator }: { operator: Person | undefined }) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  // Close the drawer whenever navigation completes.
  React.useEffect(() => setOpen(false), [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="باز کردن منو">
          <AppIcon name="menu" size={22} />
        </Button>
      </SheetTrigger>
      <SheetContent side="end" className="flex w-72 flex-col border-sidebar-border bg-sidebar text-sidebar-foreground">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-start">
            <BrandMark />
          </SheetTitle>
        </SheetHeader>
        <SidebarNav forceExpanded />
        <div className="mt-auto border-t border-sidebar-border pt-3">
          <SidebarUserMenu operator={operator} collapsed={false} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
