import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * One responsive control surface shared by every list page: Search grows to
 * fill the row, while Filters / Sort / View switcher stay content-sized and
 * wrap together as a group. Deliberately avoids fixed widths so the toolbar
 * reads as a single system rather than several detached blocks.
 *
 * Layout:
 *  - Desktop (lg+): one row — search on the start edge (flex-1), controls on
 *    the end edge.
 *  - Tablet (sm–lg): search takes a full row; controls wrap onto the next row.
 *  - Mobile: everything stacks full-width.
 */
export function ListToolbar({
  search,
  controls,
  view,
  className,
}: {
  search: ReactNode;
  controls?: ReactNode;
  view?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 flex flex-col gap-3 lg:flex-row lg:items-center", className)}>
      <div className="w-full lg:min-w-[220px] lg:flex-1">{search}</div>
      {(controls || view) && (
        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          {controls}
          {view}
        </div>
      )}
    </div>
  );
}
