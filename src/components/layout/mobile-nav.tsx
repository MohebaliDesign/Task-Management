"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/icon";
import { SidebarNav } from "./sidebar-nav";
import { BrandMark } from "./brand-mark";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  // Close the drawer whenever navigation completes.
  React.useEffect(() => setOpen(false), [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="باز کردن منو">
          <AppIcon name="more" size={22} />
        </Button>
      </SheetTrigger>
      <SheetContent side="end" className="w-72 bg-background">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-start">
            <BrandMark />
          </SheetTitle>
        </SheetHeader>
        <SidebarNav />
      </SheetContent>
    </Sheet>
  );
}
