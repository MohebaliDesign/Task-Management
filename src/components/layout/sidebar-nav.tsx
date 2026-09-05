"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppIcon, type IconName } from "@/components/icon";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: IconName;
  match: (path: string) => boolean;
}

const items: NavItem[] = [
  { href: "/", label: "داشبورد", icon: "dashboard", match: (p) => p === "/" },
  { href: "/projects", label: "پروژه‌ها", icon: "projects", match: (p) => p.startsWith("/projects") },
  { href: "/activity", label: "تاریخچه فعالیت", icon: "activity", match: (p) => p.startsWith("/activity") },
];

export function SidebarNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="ناوبری اصلی" className="flex flex-col gap-1">
      {items.map((item) => {
        const active = item.match(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
            )}
          >
            <AppIcon name={item.icon} size={20} variant={active ? "Bold" : "Linear"} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
