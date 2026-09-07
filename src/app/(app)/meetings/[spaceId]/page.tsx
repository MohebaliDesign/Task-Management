import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/icon";
import { PageHeader, SectionHeader } from "@/components/domain/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { AvatarStack, PersonChip } from "@/components/domain/person";
import { faDate, toFa } from "@/lib/utils";
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
        description={space.description || "بدون توضیحات"}
        icon="meetings"
        crumbs={[{ label: "جلسات", href: "/meetings" }, { label: space.name }]}
        actions={
          <Button asChild>
            <Link href={`/meetings/${space.id}/new`}>
              <AppIcon name="add" size={18} />
              ثبت جلسه
            </Link>
          </Button>
        }
      />

      <Card className="mb-8 flex items-center justify-between gap-3 p-4">
        <span className="text-sm text-muted-foreground">مسئول دسته</span>
        <PersonChip person={owner} showRole />
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
        <div className="space-y-3">
          {meetings.map((m) => {
            const people = m.participantIds.map((id) => getPerson(id)).filter((p): p is NonNullable<typeof p> => !!p);
            return (
              <Card key={m.id} className="relative p-4 shadow-sm transition-shadow hover:shadow-md">
                <Link
                  href={`/meetings/${space.id}/${m.id}`}
                  className="absolute inset-0 z-10 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`باز کردن ${m.title}`}
                />
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <span className="text-[10px] leading-none text-muted-foreground">جلسه</span>
                      <span className="text-sm font-semibold leading-none">{toFa(m.sequence)}</span>
                    </span>
                    <div>
                      <p className="font-medium">{m.title}</p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <AppIcon name="calendar" size={13} />
                        {faDate(m.date)} · {m.location || "بدون مکان"}
                      </p>
                    </div>
                  </div>
                  <AvatarStack people={people} max={4} />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
