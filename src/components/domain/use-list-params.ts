"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

/**
 * Shared URL-param plumbing for the list controls (search / filter / sort).
 * Keeping the list state in the URL means the server render matches, the view
 * is shareable, and every control stays in sync without a client store.
 */
export function useListParams() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const setParam = React.useCallback(
    (key: string, value: string, emptyValues: string[] = []) => {
      const next = new URLSearchParams(params.toString());
      if (!value || emptyValues.includes(value)) next.delete(key);
      else next.set(key, value);
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  return { params, pathname, router, setParam };
}
