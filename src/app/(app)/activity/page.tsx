import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/domain/empty-state";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/icon";
import { PageTopBar } from "@/components/layout/page-topbar";
import { ActivityFeed } from "@/features/activity/activity-feed";
import { getActivities } from "@/lib/queries";

export const metadata: Metadata = { title: "تاریخچهٔ فعالیت" };

const PAGE_SIZE = 25;

export default function ActivityPage({ searchParams }: { searchParams: { limit?: string } }) {
  const all = getActivities();
  const limit = Math.max(PAGE_SIZE, Number(searchParams.limit) || PAGE_SIZE);
  const visible = all.slice(0, limit);
  const hasMore = all.length > visible.length;

  return (
    <>
      <PageTopBar
        title="تاریخچهٔ فعالیت"
        description="تغییرات و رویدادهای ثبت‌شده در پنل را مرور کنید."
      />

      {visible.length === 0 ? (
        <EmptyState icon="activity" title="هنوز فعالیتی ثبت نشده است" />
      ) : (
        <>
          <ActivityFeed activities={visible} />
          {hasMore && (
            <div className="mt-2 flex justify-center">
              <Button asChild variant="outline" size="sm">
                <Link href={`/activity?limit=${limit + PAGE_SIZE}`} scroll={false}>
                  <AppIcon name="chevronDown" size={16} />
                  نمایش موارد بیشتر
                </Link>
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
}
