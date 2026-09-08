import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/icon";
import { PageHeader, type Crumb } from "@/components/domain/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { MeetingStatusBadge, ApprovalBadge } from "@/components/domain/status";
import { PersonChip } from "@/components/domain/person";
import { ActionItemRow } from "@/features/actions/action-item-row";
import { MeetingActionsBar } from "@/features/meetings/meeting-actions-bar";
import { BlockerRow } from "@/features/risks/blocker-row";
import { faDate, faRelative, toFa } from "@/lib/utils";
import { getMeetingDecisions, getMeetingActions, getMeetingBlockers, getComments, getSignatures, getPerson } from "@/lib/queries";
import type { Meeting } from "@/lib/domain";

/**
 * The single Meeting Detail experience — used identically for project
 * meetings and Meeting Space meetings (Product Principle: a Meeting is the
 * same entity everywhere). All editing (including decisions/actions) happens
 * through one entry point: "ویرایش جلسه".
 */
export function MeetingDetail({
  meeting,
  crumbs,
  editHref,
  readOnly,
}: {
  meeting: Meeting;
  crumbs: Crumb[];
  editHref: string;
  readOnly: boolean;
}) {
  const decisions = getMeetingDecisions(meeting.id);
  const actions = getMeetingActions(meeting.id);
  const blockers = getMeetingBlockers(meeting.id);
  const comments = getComments(meeting.id);
  const signatures = getSignatures(meeting.id);

  return (
    <div>
      <PageHeader
        title={meeting.title}
        crumbs={crumbs}
        description={`${faDate(meeting.date)} · ساعت ${meeting.time} · ${meeting.location || "بدون مکان"} · بازنگری ${toFa(meeting.revision)}`}
        actions={
          <div className="flex flex-col items-end gap-2">
            <MeetingStatusBadge value={meeting.status} />
            <div className="flex flex-wrap items-center gap-2">
              {!readOnly && (
                <Button asChild variant="outline" size="sm">
                  <Link href={editHref}>
                    <AppIcon name="edit" size={16} />
                    ویرایش جلسه
                  </Link>
                </Button>
              )}
              <MeetingActionsBar meetingId={meeting.id} reviewToken={meeting.reviewToken} status={meeting.status} readOnly={readOnly} />
            </div>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Summary */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><AppIcon name="clipboard" size={18} className="text-muted-foreground" />خلاصهٔ جلسه</CardTitle></CardHeader>
            <CardContent>
              {meeting.summaryPoints.length > 0 ? (
                <ul className="space-y-2">
                  {meeting.summaryPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm leading-7 text-foreground-alt">
                      <AppIcon name="check" size={15} className="mt-1.5 shrink-0 text-muted-foreground" />
                      {point}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm leading-7 text-foreground-alt">{meeting.summary}</p>
              )}
            </CardContent>
          </Card>

          {/* Discussion */}
          {meeting.discussion && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><AppIcon name="note" size={18} className="text-muted-foreground" />بحث‌ها</CardTitle></CardHeader>
              <CardContent><p className="text-sm leading-7 text-foreground-alt">{meeting.discussion}</p></CardContent>
            </Card>
          )}

          {/* Decisions — read-only here; managed together with the meeting via "ویرایش جلسه" */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><AppIcon name="decision" size={18} className="text-muted-foreground" />تصمیم‌ها ({toFa(decisions.length)})</CardTitle></CardHeader>
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
                        {d.description && <p className="mt-0.5 text-sm text-muted-foreground">{d.description}</p>}
                        <p className="mt-1 text-xs text-muted-foreground">{getPerson(d.deciderId)?.name} · حوزه: {d.area} · اثر: {d.impact}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Actions — read-only here; managed together with the meeting via "ویرایش جلسه" */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><AppIcon name="actions" size={18} className="text-muted-foreground" />اقدامات ({toFa(actions.length)})</CardTitle></CardHeader>
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

          {/* Blockers — read-only here; managed together with the meeting via "ویرایش جلسه" */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><AppIcon name="blocker" size={18} className="text-muted-foreground" />موانع ({toFa(blockers.length)})</CardTitle></CardHeader>
            <CardContent className="p-0">
              {blockers.length === 0 ? (
                <div className="p-4"><EmptyState icon="check" title="هنوز مانعی برای این جلسه ثبت نشده است." /></div>
              ) : (
                <div className="divide-y divide-border">
                  {blockers.map((b) => (
                    <BlockerRow key={b.id} blocker={b} owner={getPerson(b.ownerId)} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Next steps */}
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
            <CardHeader><CardTitle className="flex items-center gap-2 text-sm"><AppIcon name="approval" size={16} />تأییدها و بازخوردها</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {signatures.length === 0 ? (
                <p className="text-sm text-muted-foreground">هنوز درخواست بازبینی‌ای ایجاد نشده است.</p>
              ) : (
                signatures.map((s) => {
                  const hasFeedback = (s.decisionFeedback?.length ?? 0) > 0 || !!s.generalFeedback;
                  return (
                    <div key={s.id} className="rounded-md border border-border/70 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{s.approverName}</p>
                          {s.signedAt && <p className="text-xs text-muted-foreground">{faDate(s.signedAt)}</p>}
                        </div>
                        <ApprovalBadge value={s.status} />
                      </div>

                      {hasFeedback && (
                        <div className="mt-3 space-y-2.5 border-t border-border/70 pt-3">
                          {s.decisionFeedback?.map((f, i) => {
                            const decision = decisions.find((d) => d.id === f.decisionId);
                            return (
                              <div key={i} className="rounded-md bg-muted/50 p-2.5">
                                <p className="flex items-start gap-1.5 text-xs font-medium">
                                  <AppIcon name="decision" size={14} className="mt-0.5 shrink-0 text-primary" />
                                  {decision?.text ?? "تصمیم حذف‌شده"}
                                </p>
                                <p className="mt-1 text-sm leading-6 text-foreground-alt">{f.feedback}</p>
                              </div>
                            );
                          })}
                          {s.generalFeedback && (
                            <div>
                              <p className="text-xs text-muted-foreground">توضیح تکمیلی</p>
                              <p className="mt-0.5 text-sm leading-6 text-foreground-alt">{s.generalFeedback}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
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
