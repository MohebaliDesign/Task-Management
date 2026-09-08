import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/icon";
import { PageHeader, SectionHeader } from "@/components/domain/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MeetingList } from "@/features/meetings/meeting-list";
import { toFa } from "@/lib/utils";
import { roleLabels } from "@/lib/labels";
import { getMeetingSpace, getSpaceMeetings, getPerson } from "@/lib/queries";

export default function MeetingSpaceDetailPage({ params }: { params: { spaceId: string } }) {
  const space = getMeetingSpace(params.spaceId);
  if (!space) notFound();
  const meetings = getSpaceMeetings(space.id);
  const owner = getPerson(space.ownerId);

  return (
    <div>
      <PageHeader
        title={space.name}
        description="سوابق جلسات ثبت‌شده در این دسته را مشاهده و مدیریت کنید."
        icon="meetings"
        crumbs={[{ label: "جلسات", href: "/meetings" }, { label: space.name }]}
        actions={
          <Button asChild>
            <Link href={`/meetings/${space.id}/new`}>
              <AppIcon name="add" size={18} />
              ثبت جلسه جدید
            </Link>
          </Button>
        }
      />

      <Card className="mb-8 flex items-center gap-4 p-4">
        <Avatar className="h-11 w-11 shrink-0">
          <AvatarFallback className="text-sm">{owner?.initials ?? "؟"}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">مسئول دسته</p>
          {owner ? (
            <>
              <p className="truncate text-sm font-medium">{owner.name}</p>
              <p className="truncate text-xs text-muted-foreground">{roleLabels[owner.role]}</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">بدون مسئول</p>
          )}
        </div>
      </Card>

      <SectionHeader title="جلسات ثبت‌شده" icon="meetings" description={`${toFa(meetings.length)} جلسه`} />

      {meetings.length === 0 ? (
        <EmptyState
          icon="meetings"
          title="هنوز جلسه‌ای در این دسته ثبت نشده است"
          description="نخستین جلسهٔ این دسته را ثبت کنید."
          action={
            <Button asChild size="sm">
              <Link href={`/meetings/${space.id}/new`}>ثبت نخستین جلسه</Link>
            </Button>
          }
        />
      ) : (
        <MeetingList meetings={meetings} basePath={`/meetings/${space.id}`} />
      )}
    </div>
  );
}
