"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { AppIcon, type IconName } from "@/components/icon";
import { cn } from "@/lib/utils";

export interface RowAction {
  label: string;
  icon: IconName;
  href?: string;
  onSelect?: () => void;
  destructive?: boolean;
}

/**
 * Contextual actions for a table row or a card, shared across every
 * project-level table so the pattern is identical everywhere.
 *
 * Discoverability rules (brief §14–15):
 *  - Touch / narrow screens: the trigger is always visible (no hover there).
 *  - Desktop (lg+): it stays quiet until the row is hovered, is focused within
 *    (keyboard), or the menu is open — never hover-only, so keyboard users can
 *    always reach it.
 */
export function RowActions({
  actions,
  label = "عملیات ردیف",
  align = "end",
}: {
  actions: RowAction[];
  label?: string;
  align?: "start" | "end";
}) {
  if (actions.length === 0) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={label}
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          // Always visible on touch/narrow; hover/focus-reveal on desktop.
          "opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100 lg:focus-visible:opacity-100 lg:data-[state=open]:opacity-100",
        )}
      >
        <AppIcon name="more" size={18} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {actions.map((a) =>
          a.href ? (
            <DropdownMenuItem key={a.label} asChild>
              <Link href={a.href} className={cn(a.destructive && "text-destructive-text focus:text-destructive-text")}>
                <AppIcon name={a.icon} size={16} />
                {a.label}
              </Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              key={a.label}
              onSelect={a.onSelect}
              className={cn(a.destructive && "text-destructive-text focus:text-destructive-text")}
            >
              <AppIcon name={a.icon} size={16} />
              {a.label}
            </DropdownMenuItem>
          ),
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
