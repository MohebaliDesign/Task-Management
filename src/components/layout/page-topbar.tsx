"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AppIcon } from "@/components/icon";

export const TOPBAR_HEADING_ID = "app-topbar-heading";
export const TOPBAR_ACTIONS_ID = "app-topbar-actions";

export interface TopBarCrumb {
  label: string;
  href?: string;
}

/**
 * Page-level orientation (title/subtitle/CTAs), portaled into the ONE global
 * Top Bar the AppShell always renders — never a second header. Two stable
 * slots (`#app-topbar-heading`, `#app-topbar-actions`) live inside the
 * existing chrome row in app-shell.tsx; this only ever fills them in, it
 * never adds its own wrapper/border/height. Pages that don't call this
 * (detail pages with their own rich header, forms with breadcrumbs) simply
 * leave both slots empty.
 */
export function PageTopBar({
  title,
  description,
  crumbs,
  actions,
}: {
  title: string;
  description?: string;
  crumbs?: TopBarCrumb[];
  actions?: React.ReactNode;
}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  const headingEl = document.getElementById(TOPBAR_HEADING_ID);
  const actionsEl = document.getElementById(TOPBAR_ACTIONS_ID);
  if (!headingEl || !actionsEl) return null;

  return (
    <>
      {createPortal(
        <div className="min-w-0">
          {crumbs && crumbs.length > 0 && (
            <nav aria-label="مسیر" className="mb-1">
              <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                {crumbs.map((c, i) => (
                  <li key={i} className="flex items-center gap-1">
                    {c.href ? (
                      <Link href={c.href} className="rounded-sm hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        {c.label}
                      </Link>
                    ) : (
                      <span className="text-foreground">{c.label}</span>
                    )}
                    {i < crumbs.length - 1 && <AppIcon name="chevronLeft" size={12} className="opacity-50" />}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <h1 className="truncate text-lg font-semibold tracking-tight sm:text-xl">{title}</h1>
          {description && <p className="mt-0.5 max-w-2xl truncate text-xs text-muted-foreground sm:text-sm">{description}</p>}
        </div>,
        headingEl,
      )}
      {actions && createPortal(<>{actions}</>, actionsEl)}
    </>
  );
}
