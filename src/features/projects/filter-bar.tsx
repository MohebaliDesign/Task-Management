"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppIcon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { PROJECT_HEALTH, PROJECT_LIFECYCLE, PROJECT_PHASE } from "@/lib/domain";
import { healthLabels, lifecycleLabels, phaseLabels } from "@/lib/labels";

const ALL = "all";

export function ProjectsFilterBar() {
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

  // Debounce the free-text search.
  React.useEffect(() => {
    const t = setTimeout(() => update("q", q), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const health = params.get("health") ?? ALL;
  const lifecycle = params.get("lifecycle") ?? ALL;
  const phase = params.get("phase") ?? ALL;
  const sort = params.get("sort") ?? "newest";
  const hasFilters = health !== ALL || lifecycle !== ALL || phase !== ALL || sort !== "newest" || q.length > 0;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative sm:w-64">
        <span className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-muted-foreground">
          <AppIcon name="search" size={18} />
        </span>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="جست‌وجوی نام پروژه…"
          className="ps-10"
          aria-label="جست‌وجوی پروژه"
        />
      </div>

      <FilterSelect label="سلامت" value={health} onChange={(v) => update("health", v)} options={PROJECT_HEALTH.map((h) => ({ value: h, label: healthLabels[h].label }))} />
      <FilterSelect label="وضعیت" value={lifecycle} onChange={(v) => update("lifecycle", v)} options={PROJECT_LIFECYCLE.map((l) => ({ value: l, label: lifecycleLabels[l].label }))} />
      <FilterSelect label="فاز" value={phase} onChange={(v) => update("phase", v)} options={PROJECT_PHASE.map((p) => ({ value: p, label: phaseLabels[p].label }))} />

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

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full sm:w-40" aria-label={label}>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>{`همهٔ ${label}`}</SelectItem>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
