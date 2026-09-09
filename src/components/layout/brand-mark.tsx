import Link from "next/link";
import { AppIcon } from "@/components/icon";
import { cn } from "@/lib/utils";

/**
 * Product identity. The icon tile uses `sidebar-primary`/`sidebar-primary-foreground`
 * (a light surface + brand-blue icon) rather than `bg-primary`, since it always
 * sits on a solid primary-colored Sidebar surface — a same-color tile would be
 * invisible there.
 */
export function BrandMark({ iconOnly = false, className }: { iconOnly?: boolean; className?: string }) {
  return (
    <Link
      href="/"
      aria-label="سامانهٔ نظارت — بازگشت به داشبورد"
      className={cn("flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring", className)}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-2xs">
        <AppIcon name="verify" size={22} variant="Bold" />
      </span>
      {!iconOnly && (
        <span className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-sidebar-foreground">سامانهٔ نظارت</span>
          <span className="text-[11px] text-sidebar-muted/80">پروژه و پاسخگویی جلسات</span>
        </span>
      )}
    </Link>
  );
}
