import Link from "next/link";
import { Card } from "@/components/ui/card";
import { AppIcon } from "@/components/icon";
import { PersonChip } from "@/components/domain/person";
import { faDate, toFa } from "@/lib/utils";
import { getPerson, getMeetingSpaceStats } from "@/lib/queries";
import type { MeetingSpace } from "@/lib/domain";

export function MeetingSpaceCard({ space }: { space: MeetingSpace }) {
  const owner = getPerson(space.ownerId);
  const stats = getMeetingSpaceStats(space.id);

  return (
    <Card className="group relative flex flex-col p-5 shadow-sm transition-shadow hover:shadow-md">
      <Link
        href={`/meetings/${space.id}`}
        className="absolute inset-0 z-10 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`مشاهدهٔ جلسات ${space.name}`}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold">{space.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{space.description}</p>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <AppIcon name="meetings" size={18} />
        </span>
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <AppIcon name="meetings" size={14} />
          {toFa(stats.meetingCount)} جلسه ثبت‌شده
        </span>
        <span className="flex items-center gap-1.5">
          <AppIcon name="calendar" size={14} />
          {stats.lastMeetingDate ? `آخرین جلسه: ${faDate(stats.lastMeetingDate)}` : "بدون جلسه"}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <PersonChip person={owner} />
        <span className="flex items-center gap-1 text-sm font-medium text-primary">
          مشاهدهٔ جلسات
          <AppIcon name="chevronLeft" size={16} />
        </span>
      </div>
    </Card>
  );
}
