"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { AppIcon } from "@/components/icon";
import { cn } from "@/lib/utils";

export type ViewMode = "card" | "table";

/**
 * Card/Table view toggle, persisted in the URL (?view=table) so it survives
 * navigation and is shareable — same mechanism as the existing filter bars.
 * Shared by the Projects and Meetings pages.
 */
export function ViewSwitcher({ value }: { value: ViewMode }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function setView(next: ViewMode) {
    const nextParams = new URLSearchParams(params.toString());
    if (next === "card") nextParams.delete("view");
    else nextParams.set("view", next);
    const qs = nextParams.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div className="inline-flex items-center gap-0.5 rounded-md border border-border bg-card p-0.5" role="group" aria-label="نوع نمایش">
      <button
        type="button"
        onClick={() => setView("card")}
        aria-pressed={value === "card"}
        aria-label="نمایش کارتی"
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-sm transition-colors",
          value === "card" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground",
        )}
      >
        <AppIcon name="grid" size={16} />
      </button>
      <button
        type="button"
        onClick={() => setView("table")}
        aria-pressed={value === "table"}
        aria-label="نمایش جدولی"
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-sm transition-colors",
          value === "table" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground",
        )}
      >
        <AppIcon name="table" size={16} />
      </button>
    </div>
  );
}
