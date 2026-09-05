import Link from "next/link";
import { AppIcon } from "@/components/icon";

export function BrandMark() {
  return (
    <Link href="/" className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-2xs">
        <AppIcon name="verify" size={22} variant="Bold" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-sm font-semibold text-sidebar-foreground">سامانهٔ حاکمیت</span>
        <span className="text-[11px] text-sidebar-muted">پروژه و پاسخگویی جلسات</span>
      </span>
    </Link>
  );
}
