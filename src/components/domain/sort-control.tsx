"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppIcon } from "@/components/icon";
import { useListParams } from "./use-list-params";

export interface SortOption {
  value: string;
  label: string;
}

const DEFAULT_OPTIONS: SortOption[] = [
  { value: "newest", label: "جدیدترین" },
  { value: "oldest", label: "قدیمی‌ترین" },
];

/**
 * Sort select bound to a URL param (default `sort`). The first option is the
 * implicit default and is stored as an empty param so a clean URL means
 * "newest". Content-sized like the filters.
 */
export function SortControl({
  paramKey = "sort",
  options = DEFAULT_OPTIONS,
}: {
  paramKey?: string;
  options?: SortOption[];
}) {
  const { params, setParam } = useListParams();
  const defaultValue = options[0]?.value ?? "newest";
  const value = params.get(paramKey) ?? defaultValue;

  return (
    <Select value={value} onValueChange={(v) => setParam(paramKey, v, [defaultValue])}>
      <SelectTrigger className="h-9 w-auto min-w-[8.5rem] gap-1.5" aria-label="ترتیب">
        <AppIcon name="overview" size={16} className="shrink-0 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
