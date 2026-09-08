"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppIcon, type IconName } from "@/components/icon";
import { cn } from "@/lib/utils";

export function ProjectTabs({ projectId }: { projectId: string }) {
  const pathname = usePathname();
  const base = `/projects/${projectId}`;
  const tabs: { href: string; label: string; icon: IconName; exact?: boolean }[] = [
    { href: base, label: "نمای کلی", icon: "overview", exact: true },
    { href: `${base}/meetings`, label: "جلسات", icon: "meetings" },
    { href: `${base}/decisions`, label: "تصمیم‌ها", icon: "decision" },
    { href: `${base}/actions`, label: "پیگیری‌ها", icon: "blocker" },
    { href: `${base}/activity`, label: "تاریخچه", icon: "activity" },
    { href: `${base}/settings`, label: "تنظیمات", icon: "settings" },
  ];

  return (
  <div className="mb-6 border-b border-border">
    <nav aria-label="بخش‌های پروژه" className="flex gap-1">
      {tabs.map((t) => {
        const active = t.exact ? pathname === t.href : pathname.startsWith(t.href);

        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
            )}
          >
            <AppIcon name={t.icon} size={18} variant={active ? "Bold" : "Linear"} />
            {t.label}
          </Link>
        );
      })}
    </nav>
  </div>
);
}
