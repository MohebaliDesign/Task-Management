"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { AppIcon } from "@/components/icon";
import { useListParams } from "./use-list-params";

/**
 * Debounced free-text search bound to a URL param (default `q`). Fills the
 * space it's given (full width) so the parent toolbar can let it grow.
 */
export function SearchControl({
  placeholder,
  ariaLabel,
  paramKey = "q",
}: {
  placeholder: string;
  ariaLabel: string;
  paramKey?: string;
}) {
  const { params, setParam } = useListParams();
  const urlValue = params.get(paramKey) ?? "";
  const [q, setQ] = React.useState(urlValue);

  React.useEffect(() => {
    const t = setTimeout(() => setParam(paramKey, q), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  // Reflect external clears (e.g. the "clear filters" button emptying the URL).
  React.useEffect(() => {
    if (urlValue === "" && q !== "") setQ("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlValue]);

  return (
    <div className="relative w-full">
      <span className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-muted-foreground">
        <AppIcon name="search" size={18} />
      </span>
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="ps-10"
        aria-label={ariaLabel}
        type="search"
      />
    </div>
  );
}
