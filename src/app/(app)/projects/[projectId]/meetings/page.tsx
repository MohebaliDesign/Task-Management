import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/icon";
import { SectionHeader } from "@/components/domain/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { MeetingStatusBadge } from "@/components/domain/status";
import { AvatarStack } from "@/components/domain/person";
import { faDate, toFa } from "@/lib/utils";
import {
  getProject,
  getMeetings,
  getMeetingDecisions,
  getMeetingActions,
  getSignatureProgress,
  getPerson,
} from "@/lib/queries";

export default function MeetingsPage({ params }: { params: { projectId: string } }) {
  const project = getProject(params.projectId);
  if (!project) notFound();
  const meetings = getMeetings(project.id);
  const readOnly = project.lifecycle === "closed";

  return (
    <div>
      <SectionHeader
        title="جلسات پروژه"
        description="تاریخچهٔ کامل جلسات، به‌عنوان منبع اصلی تصمیم‌ها و اقدامات."
        icon="meetings"
        actions={
          !readOnly && (
            <Button asChild size="sm">
              <Link href={`/projects/${project.id}/meetings/new`}>
                <AppIcon name="add" size={16} />
                ثبت جلسه
              </Link>
            </Button>
          )
        }
      />

      {meetings.length === 0 ? (
        <EmptyState
          icon="meetings"
          title="هنوز جلسه‌ای ثبت نشده است"
          description="نخستین جلسهٔ پروژه را ثبت کنید تا تصمیم‌ها و اقدامات آن ثبت شوند."
          action={
            !readOnly && (
              <Button asChild size="sm">
                <Link href={`/projects/${project.id}/meetings/new`}>ثبت نخستین جلسه</Link>
              </Button>
            )
          }
        />
      ) : (
        <div className="space-y-3">
          {meetings.map((m) => {
            const decisions = getMeetingDecisions(m.id).length;
            const actions = getMeetingActions(m.id).length;
            const sig = getSignatureProgress(m.id);
            const people = m.participants
              .map((p) => getPerson(p.personId))
              .filter((p): p is NonNullable<typeof p> => !!p);
            return (
              <Card key={m.id} className="relative p-4 transition-shadow hover:shadow-sm">
                <Link href={`/projects/${project.id}/meetings/${m.id}`} className="absolute inset-0 z-10 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={`باز کردن ${m.title}`} />
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
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <AppIcon name="decision" size={14} /> {toFa(decisions)} تصمیم
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <AppIcon name="actions" size={14} /> {toFa(actions)} اقدام
                    </span>
                    {sig.total > 0 && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <AppIcon name="approval" size={14} /> {toFa(sig.signed)} از {toFa(sig.total)} امضا
                      </span>
                    )}
                    <AvatarStack people={people} max={3} />
                    <MeetingStatusBadge value={m.status} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
