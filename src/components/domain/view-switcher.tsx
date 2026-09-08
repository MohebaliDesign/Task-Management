"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { AppIcon } from "@/components/icon";
import { cn } from "@/lib/utils";

export type ViewMode = "card" | "table";

const OPTIONS: { value: ViewMode; label: string; icon: "grid" | "table" }[] = [
  { value: "card", label: "نمای کارتی", icon: "grid" },
  { value: "table", label: "نمای جدولی", icon: "table" },
];

/**
 * Shared Card/Table toggle used by every list page (Projects, Meeting
 * Categories…). The active view is kept in the URL (?view=table) so the server
 * render matches and the choice is shareable, and it is *also* mirrored to
 * localStorage under `storageKey` so a returning user lands on their last
 * preference. Each list namespaces its own key (e.g. "projects:view").
 *
 * Every option shows an Iconsax icon *and* a Persian label — never icon-only —
 * and the active state is conveyed by background + weight, not color alone.
 */
export function ViewSwitcher({ value, storageKey }: { value: ViewMode; storageKey: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const applyToUrl = React.useCallback(
    (next: ViewMode, { replace }: { replace: boolean }) => {
      const nextParams = new URLSearchParams(params.toString());
      if (next === "card") nextParams.delete("view");
      else nextParams.set("view", next);
      const qs = nextParams.toString();
      const href = qs ? `${pathname}?${qs}` : pathname;
      if (replace) router.replace(href, { scroll: false });
      else router.push(href, { scroll: false });
    },
    [params, pathname, router],
  );

  // On first mount, if the URL doesn't pin a view but the user has a saved
  // preference, restore it. The URL stays the source of truth thereafter.
  React.useEffect(() => {
    if (params.has("view")) return;
    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem(storageKey);
    } catch {
      /* storage may be unavailable — fall back to default */
    }
    if (saved === "table" && value !== "table") applyToUrl("table", { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setView(next: ViewMode) {
    try {
      window.localStorage.setItem(storageKey, next);
    } catch {
      /* ignore */
    }
    applyToUrl(next, { replace: true });
  }

  return (
    <div
      className="inline-flex items-center gap-1 rounded-md border border-input bg-background p-1"
      role="group"
      aria-label="نوع نمایش"
    >
      {OPTIONS.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setView(opt.value)}
            aria-pressed={active}
            className={cn(
              "flex h-8 items-center gap-1.5 rounded-sm px-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <AppIcon name={opt.icon} size={16} variant={active ? "Bold" : "Linear"} />
            <span className="whitespace-nowrap">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
