"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppIcon, type IconName } from "@/components/icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useSidebarCollapse } from "./sidebar-collapse-context";

interface NavItem {
  href: string;
  label: string;
  icon: IconName;
  match: (path: string) => boolean;
}

const items: NavItem[] = [
  { href: "/", label: "داشبورد", icon: "dashboard", match: (p) => p === "/" },
  { href: "/projects", label: "پروژه‌ها", icon: "projects", match: (p) => p.startsWith("/projects") },
  { href: "/meetings", label: "جلسات", icon: "meetings", match: (p) => p.startsWith("/meetings") },
  { href: "/people", label: "تیم و افراد", icon: "people", match: (p) => p.startsWith("/people") },
  { href: "/activity", label: "تاریخچه فعالیت", icon: "activity", match: (p) => p.startsWith("/activity") },
];

/**
 * Shared between the desktop rail (which can collapse to icons-only) and the
 * mobile drawer (always expanded — item #21: collapse is a desktop/tablet
 * behavior, mobile keeps the Sheet pattern with full labels).
 */
export function SidebarNav({ forceExpanded = false }: { forceExpanded?: boolean }) {
  const pathname = usePathname();
  const { collapsed } = useSidebarCollapse();
  const isCollapsed = !forceExpanded && collapsed;

  return (
    <nav aria-label="ناوبری اصلی" className="flex flex-col gap-1">
      {items.map((item) => {
        const active = item.match(pathname);
        const link = (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            aria-label={isCollapsed ? item.label : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
              isCollapsed && "justify-center px-0",
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-2xs"
                : "text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <AppIcon name={item.icon} size={20} variant={active ? "Bold" : "Linear"} className="shrink-0" />
            {!isCollapsed && <span className="truncate">{item.label}</span>}
          </Link>
        );

        if (!isCollapsed) return link;

        return (
          <Tooltip key={item.href}>
            <TooltipTrigger asChild>{link}</TooltipTrigger>
            <TooltipContent side="left">{item.label}</TooltipContent>
          </Tooltip>
        );
      })}
    </nav>
  );
}
