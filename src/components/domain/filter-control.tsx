"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useListParams } from "./use-list-params";

const ALL = "all";

export interface FilterOption {
  value: string;
  label: string;
}
export interface FilterOptionGroup {
  label: string;
  options: FilterOption[];
}

/**
 * A single filter select bound to a URL param. Content-sized (no fixed pixel
 * width) with a sensible minimum so long option labels stay readable while the
 * control never dominates the toolbar. Supports flat or grouped options.
 */
export function FilterControl({
  paramKey,
  label,
  options,
  groups,
  allLabel,
}: {
  paramKey: string;
  label: string;
  options?: FilterOption[];
  groups?: FilterOptionGroup[];
  /** Label for the "no filter" entry — defaults to «همهٔ {label}». */
  allLabel?: string;
}) {
  const { params, setParam } = useListParams();
  const value = params.get(paramKey) ?? ALL;

  return (
    <Select value={value} onValueChange={(v) => setParam(paramKey, v, [ALL])}>
      <SelectTrigger className="h-9 w-auto min-w-[9rem] max-w-[16rem]" aria-label={label}>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>{allLabel ?? `همهٔ ${label}`}</SelectItem>
        {options?.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
        {groups?.map((g) =>
          g.options.length > 0 ? (
            <SelectGroup key={g.label}>
              <SelectLabel>{g.label}</SelectLabel>
              {g.options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectGroup>
          ) : null,
        )}
      </SelectContent>
    </Select>
  );
}
