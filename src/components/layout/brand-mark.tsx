import Link from "next/link";
import { AppIcon } from "@/components/icon";
import { cn } from "@/lib/utils";

/**
 * Product identity. The Sidebar is white, so the icon tile is solid Primary
 * Blue — the shell's one deliberate brand-color accent at the top of the
 * navigation (item #3: keep the logo Primary Blue, unchanged).
 */
export function BrandMark({ iconOnly = false, className }: { iconOnly?: boolean; className?: string }) {
  return (
    <Link
      href="/"
      aria-label="سامانهٔ نظارت — بازگشت به داشبورد"
      className={cn("flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring", className)}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-2xs">
        <AppIcon name="verify" size={22} variant="Bold" />
      </span>
      {!iconOnly && (
        <span className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-sidebar-foreground">سامانهٔ نظارت</span>
          <span className="text-[11px] text-sidebar-muted">پروژه و پاسخگویی جلسات</span>
        </span>
      )}
    </Link>
  );
}
