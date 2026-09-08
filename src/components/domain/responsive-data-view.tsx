import type { ReactNode } from "react";
import type { ViewMode } from "./view-switcher";

/**
 * Renders the selected view responsively. A dense table is only ever shown on
 * wide screens: when the user picks Table view we still fall back to the card
 * grid below the `lg` breakpoint, so narrow/touch screens never get a squeezed
 * desktop table. Card view is cards at every width.
 *
 * Both branches are rendered and toggled with CSS (no client-side breakpoint
 * detection), which keeps it SSR-safe and avoids a hydration flash.
 */
export function ResponsiveDataView({
  view,
  cards,
  table,
}: {
  view: ViewMode;
  cards: ReactNode;
  table: ReactNode;
}) {
  if (view === "table") {
    return (
      <>
        <div className="hidden lg:block">{table}</div>
        <div className="lg:hidden">{cards}</div>
      </>
    );
  }
  return <>{cards}</>;
}
