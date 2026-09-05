import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppIcon } from "@/components/icon";
import { PageHeader } from "@/components/domain/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { MeetingStatusBadge, ApprovalBadge } from "@/components/domain/status";
import { PersonChip } from "@/components/domain/person";
import { ActionItemRow } from "@/features/actions/action-item-row";
import { MeetingActionsBar } from "@/features/meetings/meeting-actions-bar";
import { AddDecisionDialog } from "@/features/meetings/add-decision-dialog";
import { AddActionDialog } from "@/features/meetings/add-action-dialog";
import { faDate, faRelative, toFa } from "@/lib/utils";
import {
  getProject,
  getMeeting,
  getMeetingDecisions,
  getMeetingActions,
  getComments,
  getSignatures,
  getPeople,
  getPerson,
} from "@/lib/queries";

export default function MeetingDetailPage({ params }: { params: { projectId: string; meetingId: string } }) {
  const project = getProject(params.projectId);
  const meeting = getMeeting(params.meetingId);
  if (!project || !meeting || meeting.projectId !== project.id) notFound();

  const decisions = getMeetingDecisions(meeting.id);
  const actions = getMeetingActions(meeting.id);
  const comments = getComments(meeting.id);
  const signatures = getSignatures(meeting.id);
  const people = getPeople();
  const readOnly = project.lifecycle === "closed";

  return (
    <div>
      <PageHeader
        title={meeting.title}
        crumbs={[
          { label: project.name, href: `/projects/${project.id}` },
          { label: "جلسات", href: `/projects/${project.id}/meetings` },
          { label: `جلسهٔ ${toFa(meeting.sequence)}` },
        ]}
        description={`${faDate(meeting.date)} · ساعت ${meeting.time} · ${meeting.location || "بدون مکان"} · بازنگری ${toFa(meeting.revision)}`}
        actions={
          <div className="flex flex-col items-end gap-2">
            <MeetingStatusBadge value={meeting.status} />
            <MeetingActionsBar meetingId={meeting.id} reviewToken={meeting.reviewToken} status={meeting.status} readOnly={readOnly} />
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Summary */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><AppIcon name="clipboard" size={18} className="text-muted-foreground" />خلاصهٔ جلسه</CardTitle></CardHeader>
            <CardContent><p className="text-sm leading-7 text-foreground-alt">{meeting.summary}</p></CardContent>
          </Card>

          {/* Discussion */}
          {meeting.discussion && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><AppIcon name="note" size={18} className="text-muted-foreground" />بحث‌ها</CardTitle></CardHeader>
              <CardContent><p className="text-sm leading-7 text-foreground-alt">{meeting.discussion}</p></CardContent>
            </Card>
          )}

          {/* Decisions */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2"><AppIcon name="decision" size={18} className="text-muted-foreground" />تصمیم‌ها ({toFa(decisions.length)})</CardTitle>
              {!readOnly && <AddDecisionDialog projectId={project.id} meetingId={meeting.id} people={people} />}
            </CardHeader>
            <CardContent className="p-0">
              {decisions.length === 0 ? (
                <div className="p-4"><EmptyState icon="decision" title="تصمیمی ثبت نشده است" /></div>
              ) : (
                <ul className="divide-y divide-border">
                  {decisions.map((d) => (
                    <li key={d.id} className="flex items-start gap-3 p-4">
                      <AppIcon name="decision" size={18} className="mt-0.5 shrink-0 text-primary" />
                      <div>
                        <p className="text-sm">{d.text}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{getPerson(d.deciderId)?.name} · حوزه: {d.area} · اثر: {d.impact}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2"><AppIcon name="actions" size={18} className="text-muted-foreground" />اقدامات ({toFa(actions.length)})</CardTitle>
              {!readOnly && <AddActionDialog projectId={project.id} meetingId={meeting.id} people={people} decisions={decisions} />}
            </CardHeader>
            <CardContent className="p-0">
              {actions.length === 0 ? (
                <div className="p-4"><EmptyState icon="actions" title="اقدامی ثبت نشده است" /></div>
              ) : (
                <ul className="divide-y divide-border">
                  {actions.map((a) => (
                    <li key={a.id}>
                      <ActionItemRow action={a} decision={decisions.find((d) => d.id === a.relatedDecisionId)} />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Next steps / open questions */}
          {(meeting.nextSteps.length > 0 || meeting.openQuestions.length > 0) && (
            <div className="grid gap-6 sm:grid-cols-2">
              {meeting.nextSteps.length > 0 && (
                <Card>
                  <CardHeader><CardTitle className="text-sm">گام‌های بعدی</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {meeting.nextSteps.map((s, i) => (
                        <li key={i} className="flex items-start gap-2"><AppIcon name="chevronLeft" size={14} className="mt-1 shrink-0 text-muted-foreground" />{s}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
              {meeting.openQuestions.length > 0 && (
                <Card>
                  <CardHeader><CardTitle className="text-sm">پرسش‌های باز</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {meeting.openQuestions.map((q, i) => (
                        <li key={i} className="flex items-start gap-2"><AppIcon name="info" size={14} className="mt-1 shrink-0 text-muted-foreground" />{q}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Sidebar: participants, agenda, signatures, comments */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-sm"><AppIcon name="people" size={16} />شرکت‌کنندگان</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {meeting.participants.map((p) => (
                <div key={p.personId} className="flex items-center justify-between">
                  <PersonChip person={getPerson(p.personId)} />
                  {!p.attended && <span className="text-xs text-muted-foreground">غایب</span>}
                </div>
              ))}
            </CardContent>
          </Card>

          {meeting.agenda.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-sm">دستور جلسه</CardTitle></CardHeader>
              <CardContent>
                <ol className="space-y-1.5 text-sm text-foreground-alt">
                  {meeting.agenda.map((a, i) => (
                    <li key={i} className="flex gap-2"><span className="text-muted-foreground">{toFa(i + 1)}.</span>{a}</li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-sm"><AppIcon name="approval" size={16} />تأییدها و امضاها</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {signatures.length === 0 ? (
                <p className="text-sm text-muted-foreground">هنوز درخواست امضایی ایجاد نشده است.</p>
              ) : (
                signatures.map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm">{s.approverName}</p>
                      {s.signedAt && <p className="text-xs text-muted-foreground">{faDate(s.signedAt)}</p>}
                    </div>
                    <ApprovalBadge value={s.status} />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-sm"><AppIcon name="comment" size={16} />بازخوردها</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {comments.length === 0 ? (
                <p className="text-sm text-muted-foreground">بازخوردی ثبت نشده است.</p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="rounded-md bg-muted/50 p-3">
                    <p className="text-sm">{c.body}</p>
                    <p className="mt-1.5 text-xs text-muted-foreground">{c.authorName} · {faRelative(c.createdAt)}</p>
                  </div>
                ))
              )}
              <Link href={`/review/meeting/${meeting.reviewToken}`} className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                <AppIcon name="reviewer" size={14} /> مشاهدهٔ صفحهٔ بازبینی
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
