"use client";

import { useSearchParams } from "next/navigation";
import { ListToolbar } from "@/components/domain/list-toolbar";
import { SearchControl } from "@/components/domain/search-control";
import { FilterControl, type FilterOption } from "@/components/domain/filter-control";
import { SortControl } from "@/components/domain/sort-control";
import { ClearFiltersButton } from "@/components/domain/clear-filters-button";
import { ViewSwitcher, type ViewMode } from "@/components/domain/view-switcher";

/**
 * Unified Meeting Categories toolbar — same architecture as ProjectsToolbar:
 * Search · Filter (owner) · Sort · View switcher. Filters are limited to data
 * the MeetingSpace model actually carries (owner, last update).
 */
export function MeetingCategoriesToolbar({
  view,
  ownerOptions,
}: {
  view: ViewMode;
  ownerOptions: FilterOption[];
}) {
  const params = useSearchParams();
  const hasFilters =
    !!params.get("q") || !!params.get("owner") || (!!params.get("sort") && params.get("sort") !== "newest");

  return (
    <ListToolbar
      search={<SearchControl placeholder="جست‌وجو در دسته‌های جلسات" ariaLabel="جست‌وجو در دسته‌های جلسات" />}
      controls={
        <>
          <FilterControl paramKey="owner" label="مسئول" allLabel="همهٔ مسئولان" options={ownerOptions} />
          <SortControl />
          {hasFilters && <ClearFiltersButton />}
        </>
      }
      view={<ViewSwitcher value={view} storageKey="meeting-categories:view" />}
    />
  );
}
