"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppIcon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { MEETING_STATUS } from "@/lib/domain";
import { meetingStatusLabels } from "@/lib/labels";

const ALL = "all";

export interface ContextOption {
  /** "project:<id>" or "space:<id>" */
  value: string;
  label: string;
}

/** Search, filter (context/status/date), and sort — mirrors ProjectsFilterBar. */
export function MeetingsFilterBar({
  projectOptions,
  spaceOptions,
}: {
  projectOptions: ContextOption[];
  spaceOptions: ContextOption[];
}) {
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

  const context = params.get("context") ?? ALL;
  const status = params.get("status") ?? ALL;
  const period = params.get("period") ?? ALL;
  const sort = params.get("sort") ?? "newest";
  const hasFilters = context !== ALL || status !== ALL || period !== ALL || sort !== "newest" || q.length > 0;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative sm:w-64">
        <span className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-muted-foreground">
          <AppIcon name="search" size={18} />
        </span>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="جست‌وجوی عنوان جلسه…"
          className="ps-10"
          aria-label="جست‌وجوی جلسه"
        />
      </div>

      <Select value={context} onValueChange={(v) => update("context", v)}>
        <SelectTrigger className="w-full sm:w-48" aria-label="زمینه">
          <SelectValue placeholder="زمینه" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>همهٔ زمینه‌ها</SelectItem>
          {projectOptions.length > 0 && (
            <SelectGroup>
              <SelectLabel>پروژه‌ها</SelectLabel>
              {projectOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectGroup>
          )}
          {spaceOptions.length > 0 && (
            <SelectGroup>
              <SelectLabel>دسته‌های جلسات</SelectLabel>
              {spaceOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectGroup>
          )}
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={(v) => update("status", v)}>
        <SelectTrigger className="w-full sm:w-40" aria-label="وضعیت">
          <SelectValue placeholder="وضعیت" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>همهٔ وضعیت‌ها</SelectItem>
          {MEETING_STATUS.map((s) => <SelectItem key={s} value={s}>{meetingStatusLabels[s].label}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={period} onValueChange={(v) => update("period", v)}>
        <SelectTrigger className="w-full sm:w-36" aria-label="بازهٔ زمانی">
          <SelectValue placeholder="بازهٔ زمانی" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>همهٔ تاریخ‌ها</SelectItem>
          <SelectItem value="7d">۷ روز اخیر</SelectItem>
          <SelectItem value="30d">۳۰ روز اخیر</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sort} onValueChange={(v) => update("sort", v === "newest" ? "" : v)}>
        <SelectTrigger className="w-full sm:w-36" aria-label="ترتیب">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">جدیدترین</SelectItem>
          <SelectItem value="oldest">قدیمی‌ترین</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setQ("");
            const view = params.get("view");
            router.replace(view ? `${pathname}?view=${view}` : pathname, { scroll: false });
          }}
        >
          <AppIcon name="close" size={16} />
          پاک‌کردن فیلترها
        </Button>
      )}
    </div>
  );
}
