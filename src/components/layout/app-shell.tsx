import type { ReactNode } from "react";
import { SidebarNav } from "./sidebar-nav";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";
import { BrandMark } from "./brand-mark";
import { PersonChip } from "@/components/domain/person";
import { getPerson } from "@/lib/queries";

/**
 * The authenticated PM/PO application shell: fixed RTL sidebar on desktop,
 * a slide-in drawer on mobile, and a slim top bar. Reviewer/closure routes use
 * their own minimal shell (they must not expose app navigation — IA §18).
 */
export function AppShell({ children }: { children: ReactNode }) {
  const operator = getPerson("p_sara");
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[16rem_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen flex-col border-e border-sidebar-border bg-sidebar p-4 lg:flex">
        <div className="mb-8 px-1">
          <BrandMark />
        </div>
        <SidebarNav />
        <div className="mt-auto rounded-lg border border-sidebar-border bg-card p-3">
          <PersonChip person={operator} showRole />
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-6">
          <div className="flex items-center gap-2">
            <MobileNav />
            <span className="lg:hidden">
              <BrandMark />
            </span>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
