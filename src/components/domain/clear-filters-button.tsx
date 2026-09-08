"use client";

import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/icon";
import { useListParams } from "./use-list-params";

/**
 * Clears every list param (search / filters / sort) while preserving the
 * chosen `view`. Only render it when a filter is actually active.
 */
export function ClearFiltersButton() {
  const { params, pathname, router } = useListParams();
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-9"
      onClick={() => {
        const view = params.get("view");
        router.replace(view ? `${pathname}?view=${view}` : pathname, { scroll: false });
      }}
    >
      <AppIcon name="close" size={16} />
      پاک‌کردن فیلترها
    </Button>
  );
}
