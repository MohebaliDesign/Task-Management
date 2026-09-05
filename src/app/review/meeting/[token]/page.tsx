import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppIcon } from "@/components/icon";
import { BrandMark } from "@/components/layout/brand-mark";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { MeetingStatusBadge, ApprovalBadge } from "@/components/domain/status";
import { PersonChip } from "@/components/domain/person";
import { EmptyState } from "@/components/domain/empty-state";
import { ReviewCommentForm } from "@/features/review/review-comment-form";
import { ReviewSignForm } from "@/features/review/review-sign-form";
import {
  getMeetingByToken, getProject, getMeetingDecisions, getMeetingActions,
  getDependencyViews, getBlockers, getSignatures, getComments, getPerson,
} from "@/lib/queries";
import { faDate, faRelative, toFa } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function ReviewPage({ params }: { params: { token: string } }) {
  const meeting = getMeetingByToken(params.token);

  if (!meeting) {
    return (
      <ReviewShell>
        <div className="mx-auto max-w-md py-16">
          <EmptyState
            icon="info"
            title="پیوند بازبینی نامعتبر است"
            description="این پیوند معتبر نیست یا منقضی شده است. لطفاً از مدیر پروژه پیوند تازه‌ای درخواست کنید."
          />
        </div>
      </ReviewShell>
    );
  }

  const project = getProject(meeting.projectId);
  const decisions = getMeetingDecisions(meeting.id);
  const actions = getMeetingActions(meeting.id);
  const deps = getDependencyViews(meeting.projectId).filter(
    (d) => d.blocking?.meetingId === meeting.id || d.blocked?.meetingId === meeting.id,
  );
  const blockers = getBlockers(meeting.projectId).filter((b) => b.meetingId === meeting.id);
  const signatures = getSignatures(meeting.id);
  const comments = getComments(meeting.id);
  const pendingSignatures = signatures.filter((s) => s.status === "pending");
  const isApproved = meeting.status === "approved";

  return (
    <ReviewShell>
      <div className="mx-auto max-w-3xl space-y-6 py-8">
        {/* Identity */}
        <div>
          <p className="text-sm text-muted-foreground">{project?.name} — {project?.versionLabel}</p>
          <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-2xl font-semibold">{meeting.title}</h1>
            <MeetingStatusBadge value={meeting.status} />
          </div>
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><AppIcon name="calendar" size={14} /> {faDate(meeting.date)} · ساعت {meeting.time}</span>
            <span className="flex items-center gap-1"><AppIcon name="people" size={14} /> {toFa(meeting.participants.length)} شرکت‌کننده</span>
          </p>
        </div>

        {isApproved && (
          <div className="flex items-center gap-2 rounded-md border border-success/20 bg-success-subtle px-4 py-3 text-sm text-success">
            <AppIcon name="verify" size={18} variant="Bold" />
            این جلسه تأیید و امضا شده است. سابقهٔ تأیید حفظ شده است.
          </div>
        )}

        {/* Summary */}
        <Card>
          <CardHeader><CardTitle className="text-base">خلاصهٔ جلسه</CardTitle></CardHeader>
          <CardContent><p className="text-sm leading-7 text-foreground-alt">{meeting.summary}</p></CardContent>
        </Card>

        {/* Decisions */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><AppIcon name="decision" size={18} className="text-primary" />تصمیم‌ها</CardTitle></CardHeader>
          <CardContent className="p-0">
            {decisions.length === 0 ? <div className="p-4"><EmptyState icon="decision" title="تصمیمی ثبت نشده است" /></div> : (
              <ul className="divide-y divide-border">
                {decisions.map((d) => (
                  <li key={d.id} className="p-4">
                    <p className="text-sm">{d.text}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{getPerson(d.deciderId)?.name} · {d.area}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><AppIcon name="actions" size={18} className="text-muted-foreground" />اقدامات و مسئولیت‌ها</CardTitle></CardHeader>
          <CardContent className="p-0">
            {actions.length === 0 ? <div className="p-4"><EmptyState icon="actions" title="اقدامی ثبت نشده است" /></div> : (
              <ul className="divide-y divide-border">
                {actions.map((a) => (
                  <li key={a.id} className="flex items-start justify-between gap-3 p-4">
                    <div>
                      <p className="text-sm font-medium">{a.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{a.deadline ? `مهلت: ${faDate(a.deadline)}` : "بدون مهلت"}</p>
                    </div>
                    <PersonChip person={getPerson(a.ownerId)} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Dependencies / blockers */}
        {(deps.length > 0 || blockers.length > 0) && (
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><AppIcon name="blocker" size={18} className="text-destructive-text" />وابستگی‌ها و موانع</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {blockers.map((b) => (
                <p key={b.id} className="flex items-start gap-2 text-sm"><AppIcon name="blocker" size={15} className="mt-0.5 shrink-0 text-destructive-text" />{b.title}</p>
              ))}
              {deps.map((d) => (
                <p key={d.dependency.id} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <AppIcon name="dependency" size={15} className="mt-0.5 shrink-0" />
                  «{d.blocked?.title}» در انتظار «{d.blocking?.title}»
                </p>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Next steps */}
        {meeting.nextSteps.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-base">گام‌های بعدی</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-1.5 text-sm">
                {meeting.nextSteps.map((s, i) => <li key={i} className="flex items-start gap-2"><AppIcon name="chevronLeft" size={14} className="mt-1 shrink-0 text-muted-foreground" />{s}</li>)}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Comments */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><AppIcon name="comment" size={18} className="text-muted-foreground" />بازخوردها</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {comments.length > 0 && (
              <div className="space-y-2">
                {comments.map((c) => (
                  <div key={c.id} className="rounded-md bg-muted/50 p-3">
                    <p className="text-sm">{c.body}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{c.authorName} · {faRelative(c.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
            <ReviewCommentForm meetingId={meeting.id} />
          </CardContent>
        </Card>

        {/* Signatures + sign */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><AppIcon name="approval" size={18} className="text-primary" />تأیید و امضا</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {signatures.map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-2 text-sm">
                  <span>{s.approverName}</span>
                  <ApprovalBadge value={s.status} />
                </div>
              ))}
            </div>
            {!isApproved && (
              <div className="border-t border-border pt-4">
                <p className="mb-3 text-sm text-muted-foreground">
                  با تأیید، شما نتیجهٔ این جلسه را می‌پذیرید. این اقدام در سابقهٔ تأیید ثبت می‌شود.
                </p>
                <ReviewSignForm meetingId={meeting.id} pending={pendingSignatures} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ReviewShell>
  );
}

function ReviewShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <BrandMark />
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted-foreground sm:inline">صفحهٔ بازبینی جلسه</span>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <div className="px-4">{children}</div>
    </div>
  );
}
