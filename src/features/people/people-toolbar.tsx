"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppIcon } from "@/components/icon";
import { ViewSwitcher, type ViewMode } from "@/components/domain/view-switcher";
import { ROLE } from "@/lib/domain";
import { roleLabels } from "@/lib/labels";
import { toFa } from "@/lib/utils";
import type { Team } from "@/lib/domain";

const ALL = "all";

export function PeopleToolbar({ teams, resultCount, view }: { teams: Team[]; resultCount: number; view: ViewMode }) {
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

  const role = params.get("role") ?? ALL;
  const team = params.get("team") ?? ALL;
  const sort = params.get("sort") ?? "name";
  const hasFilters = role !== ALL || team !== ALL || q.length > 0;

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative sm:w-56">
        <span className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-muted-foreground">
          <AppIcon name="search" size={16} />
        </span>
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جست‌وجو در افراد" className="ps-9" aria-label="جست‌وجو در افراد" />
      </div>

      <Select value={role} onValueChange={(v) => update("role", v)}>
        <SelectTrigger className="w-full sm:w-40" aria-label="نقش"><SelectValue placeholder="نقش" /></SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>همهٔ نقش‌ها</SelectItem>
          {ROLE.map((r) => <SelectItem key={r} value={r}>{roleLabels[r]}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={team} onValueChange={(v) => update("team", v)}>
        <SelectTrigger className="w-full sm:w-40" aria-label="تیم"><SelectValue placeholder="تیم" /></SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>همهٔ تیم‌ها</SelectItem>
          {teams.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={sort} onValueChange={(v) => update("sort", v)}>
        <SelectTrigger className="w-full sm:w-40" aria-label="ترتیب"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="name">ترتیب: نام</SelectItem>
          <SelectItem value="role">ترتیب: نقش</SelectItem>
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

      <span className="text-xs text-muted-foreground sm:me-auto">{toFa(resultCount)} نفر</span>

      <ViewSwitcher value={view} />
    </div>
  );
}
