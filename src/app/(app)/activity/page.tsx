import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/domain/empty-state";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/icon";
import { PageTopBar } from "@/components/layout/page-topbar";
import { ActivityFeed } from "@/features/activity/activity-feed";
import { ActivityToolbar, type ActorOption } from "@/features/activity/activity-toolbar";
import { ACTIVITY_FILTER_GROUPS, type ActivityFilterGroup } from "@/features/activity/activity-meta";
import { getActivities, getProject } from "@/lib/queries";
import { activityLabels } from "@/lib/labels";

export const metadata: Metadata = { title: "تاریخچهٔ فعالیت" };

const PAGE_SIZE = 25;

interface SearchParams {
  q?: string;
  type?: string;
  actor?: string;
  sort?: string;
  limit?: string;
}

export default function ActivityPage({ searchParams }: { searchParams: SearchParams }) {
  const all = getActivities();

  const actors: ActorOption[] = Array.from(
    all.reduce((map, a) => (map.has(a.actorId) ? map : map.set(a.actorId, a.actorName)), new Map<string, string>()),
  ).map(([id, name]) => ({ id, name }));

  const q = (searchParams.q ?? "").trim();
  let filtered = all;
  if (q) {
    filtered = filtered.filter((a) => {
      const project = getProject(a.projectId);
      const haystack = `${a.entityLabel} ${a.actorName} ${activityLabels[a.type]} ${project?.name ?? ""}`;
      return haystack.includes(q);
    });
  }
  const type = (searchParams.type ?? "all") as ActivityFilterGroup;
  if (type !== "all") {
    const types = ACTIVITY_FILTER_GROUPS[type];
    filtered = filtered.filter((a) => (types as readonly string[]).includes(a.type));
  }
  if (searchParams.actor) filtered = filtered.filter((a) => a.actorId === searchParams.actor);
  if (searchParams.sort === "oldest") filtered = [...filtered].reverse();

  const limit = Math.max(PAGE_SIZE, Number(searchParams.limit) || PAGE_SIZE);
  const visible = filtered.slice(0, limit);
  const hasMore = filtered.length > visible.length;

  const hasAnyActivity = all.length > 0;
  const hasFilters = !!(searchParams.q || (searchParams.type && searchParams.type !== "all") || searchParams.actor || searchParams.sort);

  return (
    <>
      <PageTopBar
        title="تاریخچهٔ فعالیت"
        description="همهٔ تغییرات و رویدادهای ثبت‌شده در پروژه‌ها، جلسات و بازبینی‌ها را در یکجا پیگیری کنید."
        icon="activity"
      />

      {hasAnyActivity && <ActivityToolbar actors={actors} />}

      {visible.length === 0 ? (
        <EmptyState
          icon="activity"
          title={hasAnyActivity ? "فعالیتی پیدا نشد" : "هنوز فعالیتی ثبت نشده است"}
          description={hasFilters ? "فیلترها یا عبارت جست‌وجو را تغییر دهید." : undefined}
        />
      ) : (
        <>
          <ActivityFeed activities={visible} />
          {hasMore && (
            <div className="mt-4 flex justify-center">
              <Button asChild variant="outline" size="sm">
                <LoadMoreLink searchParams={searchParams} nextLimit={limit + PAGE_SIZE} />
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
}

function LoadMoreLink({ searchParams, nextLimit }: { searchParams: SearchParams; nextLimit: number }) {
  const params = new URLSearchParams();
  if (searchParams.q) params.set("q", searchParams.q);
  if (searchParams.type) params.set("type", searchParams.type);
  if (searchParams.actor) params.set("actor", searchParams.actor);
  if (searchParams.sort) params.set("sort", searchParams.sort);
  params.set("limit", String(nextLimit));

  return (
    <Link href={`/activity?${params.toString()}`} scroll={false}>
      <AppIcon name="chevronDown" size={16} />
      نمایش موارد بیشتر
    </Link>
  );
}
