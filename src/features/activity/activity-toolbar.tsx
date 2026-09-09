"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/icon";
import { ACTIVITY_FILTER_GROUPS, activityFilterGroupLabels, type ActivityFilterGroup } from "./activity-meta";

const ALL = "all";

export interface ActorOption {
  id: string;
  name: string;
}

/** Compact, URL-driven toolbar (item #46) — search + progressive-disclosure filters, same pattern as Projects/Meetings/People toolbars. */
export function ActivityToolbar({ actors }: { actors: ActorOption[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [q, setQ] = React.useState(params.get("q") ?? "");

  const update = React.useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (!value || value === ALL) next.delete(key);
      else next.set(key, value);
      next.delete("limit");
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [params, pathname, router],
  );

  React.useEffect(() => {
    const t = setTimeout(() => update("q", q), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const group = (params.get("type") ?? ALL) as ActivityFilterGroup;
  const actor = params.get("actor") ?? ALL;
  const sort = params.get("sort") ?? "newest";
  const hasFilters = group !== ALL || actor !== ALL || sort !== "newest" || q.length > 0;

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative sm:w-64">
        <span className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-muted-foreground">
          <AppIcon name="search" size={16} />
        </span>
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جست‌وجو در فعالیت‌ها" className="ps-9" aria-label="جست‌وجو در فعالیت‌ها" />
      </div>

      <Select value={group} onValueChange={(v) => update("type", v)}>
        <SelectTrigger className="w-full sm:w-40" aria-label="نوع فعالیت"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{activityFilterGroupLabels.all}</SelectItem>
          {(Object.keys(ACTIVITY_FILTER_GROUPS) as (keyof typeof ACTIVITY_FILTER_GROUPS)[]).map((g) => (
            <SelectItem key={g} value={g}>{activityFilterGroupLabels[g]}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={actor} onValueChange={(v) => update("actor", v)}>
        <SelectTrigger className="w-full sm:w-40" aria-label="فرد انجام‌دهنده"><SelectValue placeholder="فرد" /></SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>همهٔ افراد</SelectItem>
          {actors.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={sort} onValueChange={(v) => update("sort", v === "newest" ? "" : v)}>
        <SelectTrigger className="w-full sm:w-36" aria-label="ترتیب"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">جدیدترین</SelectItem>
          <SelectItem value="oldest">قدیمی‌ترین</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => { setQ(""); router.replace(pathname, { scroll: false }); }}
        >
          <AppIcon name="close" size={16} />
          پاک‌کردن فیلترها
        </Button>
      )}
    </div>
  );
}
