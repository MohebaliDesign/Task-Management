import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";
import { BrandMark } from "./brand-mark";
import { SidebarCollapseProvider } from "./sidebar-collapse-context";
import { TOPBAR_ROW_ID } from "./page-topbar";
import { getPerson } from "@/lib/queries";

/**
 * The authenticated PM/PO application shell: a persistent, primary-tinted
 * navigation rail on desktop (collapsible, item #17), a slide-in drawer on
 * mobile, and a white sticky Top Bar that carries both the global chrome
 * (mobile menu, theme toggle) and — via `#app-topbar-row` — each page's own
 * title/subtitle/actions (items #1-16). Reviewer/closure routes use their own
 * minimal shell (they must not expose app navigation — IA §18).
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
            <div className="flex h-14 items-center justify-between gap-3 px-4 lg:px-6">
              <div className="flex items-center gap-2">
                <MobileNav operator={operator} />
                <span className="lg:hidden">
                  <BrandMark />
                </span>
              </div>
              <div className="flex items-center gap-1">
                <ThemeToggle />
              </div>
            </div>
            {/* Per-page title/subtitle/CTAs portal here — see page-topbar.tsx. Empty on pages that keep their own in-content header (item #78). */}
            <div id={TOPBAR_ROW_ID} className="border-t border-border px-4 py-3 empty:hidden empty:border-0 empty:p-0 lg:px-6" />
          </header>
          <main className="flex-1 bg-background px-4 py-6 lg:px-8 lg:py-8">
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
    </SidebarCollapseProvider>
  );
}
