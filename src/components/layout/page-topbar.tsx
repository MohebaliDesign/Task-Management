"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AppIcon, type IconName } from "@/components/icon";
import { cn } from "@/lib/utils";

export const TOPBAR_ROW_ID = "app-topbar-row";

export interface TopBarCrumb {
  label: string;
  href?: string;
}

/**
 * Page-level orientation (title/subtitle/CTAs) rendered into the persistent
 * app Top Bar instead of duplicated inside page content — items #8-13.
 *
 * Implemented as a portal into a slot the AppShell always renders
 * (`#app-topbar-row`, see app-shell.tsx). The slot is empty by default
 * (`empty:hidden`) so pages that don't use PageTopBar — detail pages with
 * their own rich header, forms with breadcrumbs — leave the Top Bar showing
 * only its persistent chrome, exactly as item #78 requires ("do not move
 * deeply nested section headings into the global Top Bar").
 */
export function PageTopBar({
  title,
  description,
  icon,
  crumbs,
  actions,
}: {
  title: string;
  description?: string;
  icon?: IconName;
  crumbs?: TopBarCrumb[];
  actions?: React.ReactNode;
}) {
  const [target, setTarget] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    setTarget(document.getElementById(TOPBAR_ROW_ID));
  }, []);

  if (!target) return null;

  return createPortal(
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
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
        <div className="flex items-center gap-2.5">
          {icon && (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <AppIcon name={icon} size={20} />
            </span>
          )}
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold tracking-tight sm:text-xl">{title}</h1>
            {description && <p className="mt-0.5 max-w-2xl truncate text-xs text-muted-foreground sm:text-sm">{description}</p>}
          </div>
        </div>
      </div>
      {actions && <div className={cn("flex shrink-0 flex-wrap items-center gap-2")}>{actions}</div>}
    </div>,
    target,
  );
}
