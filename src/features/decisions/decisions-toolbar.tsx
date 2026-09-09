"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppIcon } from "@/components/icon";
import { RISK_LEVEL } from "@/lib/domain";
import { riskLevelLabels } from "@/lib/labels";

const ALL = "all";

/**
 * Same URL-searchParams-driven pattern as the shared list controls: state lives
 * in the URL (shareable, works with server rendering) rather than client state,
 * so the page component just reads searchParams and filters server-side.
 */
export function DecisionsToolbar({ resultCount }: { resultCount: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [q, setQ] = React.useState(params.get("q") ?? "");

  const update = React.useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (!value || value === ALL) next.delete(key);
      else next.set(key, value);
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [params, pathname, router],
  );

  React.useEffect(() => {
    const t = setTimeout(() => update("q", q), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const impact = params.get("impact") ?? ALL;
  const sort = params.get("sort") ?? "newest";
  const view = params.get("view") ?? "card";
  const hasFilters = impact !== ALL || q.length > 0;

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative sm:w-56">
          <span className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-muted-foreground">
            <AppIcon name="search" size={16} />
          </span>
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="جست‌وجوی تصمیم…"
            className="ps-9"
            aria-label="جست‌وجوی تصمیم"
          />
        </div>

        <Select value={impact} onValueChange={(v) => update("impact", v)}>
          <SelectTrigger className="w-full sm:w-36" aria-label="میزان اثر"><SelectValue placeholder="میزان اثر" /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>همهٔ سطوح اثر</SelectItem>
            {RISK_LEVEL.map((l) => <SelectItem key={l} value={l}>{riskLevelLabels[l].label}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={(v) => update("sort", v)}>
          <SelectTrigger className="w-full sm:w-36" aria-label="ترتیب"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">جدیدترین</SelectItem>
            <SelectItem value="oldest">قدیمی‌ترین</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <button
            type="button"
            onClick={() => { setQ(""); router.replace(pathname, { scroll: false }); }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <AppIcon name="close" size={14} />
            پاک‌کردن فیلترها
          </button>
        )}

        <span className="text-xs text-muted-foreground">{resultCount} تصمیم</span>
      </div>

      <Tabs value={view} onValueChange={(v) => update("view", v)}>
        <TabsList>
          <TabsTrigger value="card"><AppIcon name="projects" size={15} /> کارت</TabsTrigger>
          <TabsTrigger value="table"><AppIcon name="clipboard" size={15} /> جدول</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
