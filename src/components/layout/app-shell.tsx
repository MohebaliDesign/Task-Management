import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarCollapseProvider } from "./sidebar-collapse-context";
import { TOPBAR_HEADING_ID, TOPBAR_ACTIONS_ID } from "./page-topbar";
import { getPerson } from "@/lib/queries";

/**
 * The authenticated PM/PO application shell: a strong Primary Blue navigation
 * rail on desktop (collapsible), a slide-in drawer on mobile, and exactly ONE
 * white sticky Top Bar. The Top Bar carries the persistent global chrome
 * (mobile menu trigger, Theme toggle) plus — via the `#app-topbar-heading` /
 * `#app-topbar-actions` slots — each page's own title/subtitle/CTAs
 * (PageTopBar portals into them). There is no second header row: on pages
 * that don't call PageTopBar the two slots are simply empty and the bar
 * shows only its global chrome. Reviewer/closure routes use their own
 * minimal shell (they must not expose app navigation).
 */
export function AppShell({ children }: { children: ReactNode }) {
  const operator = getPerson("p_sara");
  return (
    <SidebarCollapseProvider>
      <div className="min-h-screen bg-background lg:grid lg:grid-cols-[auto_1fr]">
        <Sidebar operator={operator} />

        {/* Main column */}
        <div className="flex min-h-screen min-w-0 flex-col">
          <header className="sticky top-0 z-30 border-b border-border bg-background">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 lg:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <MobileNav operator={operator} />
                <div id={TOPBAR_HEADING_ID} className="min-w-0 empty:hidden" />
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <div id={TOPBAR_ACTIONS_ID} className="flex flex-wrap items-center justify-end gap-2 empty:hidden" />
                <Separator orientation="vertical" className="h-6" />
                <ThemeToggle />
              </div>
            </div>
          </header>
          <main className="flex-1 bg-background px-4 py-6 lg:px-8 lg:py-8">
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
    </SidebarCollapseProvider>
  );
}
