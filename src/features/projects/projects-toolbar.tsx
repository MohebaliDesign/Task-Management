"use client";

import { useSearchParams } from "next/navigation";
import { ListToolbar } from "@/components/domain/list-toolbar";
import { SearchControl } from "@/components/domain/search-control";
import { FilterControl } from "@/components/domain/filter-control";
import { SortControl } from "@/components/domain/sort-control";
import { ClearFiltersButton } from "@/components/domain/clear-filters-button";
import { ViewSwitcher, type ViewMode } from "@/components/domain/view-switcher";
import { PROJECT_HEALTH, PROJECT_LIFECYCLE, PROJECT_PHASE } from "@/lib/domain";
import { healthLabels, lifecycleLabels, phaseLabels } from "@/lib/labels";

/** Unified Projects list toolbar: Search · Filters · Sort · View switcher. */
export function ProjectsToolbar({ view }: { view: ViewMode }) {
  const params = useSearchParams();
  const hasFilters =
    !!params.get("q") ||
    !!params.get("health") ||
    !!params.get("lifecycle") ||
    !!params.get("phase") ||
    (!!params.get("sort") && params.get("sort") !== "newest");

  return (
    <ListToolbar
      search={<SearchControl placeholder="جست‌وجو در پروژه‌ها" ariaLabel="جست‌وجو در پروژه‌ها" />}
      controls={
        <>
          <FilterControl
            paramKey="health"
            label="سلامت"
            options={PROJECT_HEALTH.map((h) => ({ value: h, label: healthLabels[h].label }))}
          />
          <FilterControl
            paramKey="lifecycle"
            label="وضعیت"
            options={PROJECT_LIFECYCLE.map((l) => ({ value: l, label: lifecycleLabels[l].label }))}
          />
          <FilterControl
            paramKey="phase"
            label="فاز"
            options={PROJECT_PHASE.map((p) => ({ value: p, label: phaseLabels[p].label }))}
          />
          <SortControl />
          {hasFilters && <ClearFiltersButton />}
        </>
      }
      view={<ViewSwitcher value={view} storageKey="projects:view" />}
    />
  );
}
