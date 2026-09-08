import type { Metadata } from "next";
import { AppIcon } from "@/components/icon";
import { BrandMark } from "@/components/layout/brand-mark";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { MeetingStatusBadge, ApprovalBadge } from "@/components/domain/status";
import { PersonAvatar } from "@/components/domain/person";
import { EmptyState } from "@/components/domain/empty-state";
import { ReviewPanel, type ReviewParticipant, type ReviewDecision } from "@/features/review/review-panel";
import {
  getMeetingByToken, getProject, getMeetingSpace, getMeetingDecisions, getMeetingActions,
  getDependencyViews, getBlockers, getSignatures, getPerson,
} from "@/lib/queries";
import { roleLabels } from "@/lib/labels";
import { faDate, toFa } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "بازبینی جلسه" };

export default function ReviewPage({ params }: { params: { token: string } }) {
  const meeting = getMeetingByToken(params.token);

  if (!meeting) {
    return (
      <ReviewShell>
        <div className="mx-auto max-w-md py-16">
          <EmptyState
            icon="info"
            title="پیوند بازبینی نامعتبر است"
            description="این پیوند معتبر نیست یا منقضی شده است. لطفاً از مدیر جلسه پیوند تازه‌ای درخواست کنید."
          />
        </div>
      </ReviewShell>
    );
  }

  const project = meeting.projectId ? getProject(meeting.projectId) : undefined;
  const space = meeting.spaceId ? getMeetingSpace(meeting.spaceId) : undefined;
  const contextLabel = project ? `${project.name} — ${project.versionLabel}` : space?.name ?? "جلسهٔ سازمانی";

  const decisions = getMeetingDecisions(meeting.id);
  const actions = getMeetingActions(meeting.id);
  const blockers = meeting.projectId ? getBlockers(meeting.projectId).filter((b) => b.meetingId === meeting.id) : [];
  const deps = meeting.projectId
    ? getDependencyViews(meeting.projectId).filter((d) => d.blocking?.meetingId === meeting.id || d.blocked?.meetingId === meeting.id)
    : [];
  const signatures = getSignatures(meeting.id);

  const attended = meeting.participants.filter((p) => p.attended).map((p) => getPerson(p.personId)).filter(Boolean);
  const absent = meeting.participants.filter((p) => !p.attended).map((p) => getPerson(p.personId)).filter(Boolean);

  const isApproved = meeting.status === "approved";
  const respondedIds = new Set(signatures.filter((s) => s.status !== "pending").map((s) => s.approverId));
  const panelParticipants: ReviewParticipant[] = meeting.participants
    .map((p) => getPerson(p.personId))
    .filter((p): p is NonNullable<typeof p> => !!p)
    .map((p) => ({ id: p.id, name: p.name, responded: respondedIds.has(p.id) }));
  const panelDecisions: ReviewDecision[] = decisions.map((d) => ({ id: d.id, text: d.text, description: d.description }));

  const recorded = signatures.filter((s) => s.status !== "pending");

  return (
    <ReviewShell>
      <main className="mx-auto max-w-2xl space-y-8 py-8">
        {/* Identity + compact metadata */}
        <header>
          <p className="text-sm text-muted-foreground">{contextLabel}</p>
          <div className="mt-1 flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
            <h1 className="text-2xl font-semibold leading-tight">{meeting.title}</h1>
            <MeetingStatusBadge value={meeting.status} />
          </div>
          <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><AppIcon name="calendar" size={15} /> {faDate(meeting.date)}</span>
            <span className="flex items-center gap-1.5"><AppIcon name="clock" size={15} /> ساعت {meeting.time}</span>
            <span className="flex items-center gap-1.5"><AppIcon name="people" size={15} /> {toFa(meeting.participants.length)} شرکت‌کننده</span>
          </p>
        </header>

        {isApproved && (
          <div className="flex items-start gap-2.5 rounded-lg border border-success/20 bg-success-subtle px-4 py-3 text-sm text-success">
            <AppIcon name="verify" size={18} variant="Bold" className="mt-0.5 shrink-0" />
            <span>این جلسه تأیید و امضا شده است. سابقهٔ تأیید حفظ شده است.</span>
          </div>
        )}

        {/* 1 — Meeting summary (quick orientation) */}
        <Section title="خلاصه جلسه" icon="clipboard">
          {meeting.summaryPoints.length > 0 ? (
            <ul className="space-y-2.5">
              {meeting.summaryPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm leading-7 text-foreground-alt">
                  <AppIcon name="check" size={16} className="mt-1.5 shrink-0 text-primary" />
                  {point}
                </li>
              ))}
            </ul>
          ) : meeting.summary ? (
            <p className="text-sm leading-7 text-foreground-alt">{meeting.summary}</p>
          ) : (
            <p className="text-sm text-muted-foreground">خلاصه‌ای برای این جلسه ثبت نشده است.</p>
          )}
        </Section>

        {/* 2 — Decisions (central; acknowledged even when empty) */}
        <Section title="تصمیمات جلسه" icon="decision" count={decisions.length}>
          {decisions.length === 0 ? (
            <p className="text-sm text-muted-foreground">تصمیمی برای این جلسه ثبت نشده است.</p>
          ) : (
            <ul className="space-y-3">
              {decisions.map((d) => {
                const decider = getPerson(d.deciderId);
                return (
                  <li key={d.id} className="rounded-lg border border-border p-4">
                    <p className="text-sm font-medium leading-7">{d.text}</p>
                    {d.description && <p className="mt-1 text-sm leading-7 text-muted-foreground">{d.description}</p>}
                    {(decider || d.area) && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        {decider ? `تصمیم‌گیرنده: ${decider.name}` : ""}
                        {decider && d.area ? " · " : ""}
                        {d.area ? `حوزه: ${d.area}` : ""}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Section>

        {/* 3 — Actions */}
        {actions.length > 0 && (
          <Section title="اقدامات بعدی" icon="actions" count={actions.length}>
            <ul className="space-y-3">
              {actions.map((a) => {
                const owner = getPerson(a.ownerId);
                const related = decisions.find((d) => d.id === a.relatedDecisionId);
                return (
                  <li key={a.id} className="rounded-lg border border-border p-4">
                    <p className="text-sm font-medium leading-7">{a.title}</p>
                    <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><AppIcon name="profile" size={13} /> {owner ? owner.name : "بدون مسئول"}</span>
                      {a.deadline && <span className="flex items-center gap-1"><AppIcon name="calendar" size={13} /> مهلت: {faDate(a.deadline)}</span>}
                      {related && <span className="flex items-center gap-1"><AppIcon name="decision" size={13} /> مرتبط با تصمیم</span>}
                    </p>
                  </li>
                );
              })}
            </ul>
          </Section>
        )}

        {/* 4 — Blockers */}
        {blockers.length > 0 && (
          <Section title="موانع" icon="blocker" count={blockers.length} description="مواردی که می‌توانند باعث توقف یا کند شدن پیشرفت کار شوند.">
            <ul className="space-y-2.5">
              {blockers.map((b) => (
                <li key={b.id} className="flex items-start gap-2.5 rounded-lg border border-border p-4">
                  <AppIcon name="blocker" size={16} className="mt-0.5 shrink-0 text-destructive-text" />
                  <div>
                    <p className="text-sm font-medium leading-7">{b.title}</p>
                    {b.description && <p className="mt-1 text-sm leading-7 text-muted-foreground">{b.description}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* 5 — Dependencies */}
        {deps.length > 0 && (
          <Section title="وابستگی‌ها" icon="dependency" count={deps.length}>
            <ul className="space-y-2.5">
              {deps.map((d) => {
                const owner = d.blocking ? getPerson(d.blocking.ownerId) : undefined;
                return (
                  <li key={d.dependency.id} className="rounded-lg border border-border p-4 text-sm leading-7">
                    <span className="font-medium">«{d.blocked?.title ?? "؟"}»</span>
                    <span className="text-muted-foreground"> در انتظار </span>
                    <span className="font-medium">«{d.blocking?.title ?? "؟"}»</span>
                    <span className="text-muted-foreground"> است.</span>
                    {owner && <span className="mt-1 block text-xs text-muted-foreground">مسئول: {owner.name}</span>}
                  </li>
                );
              })}
            </ul>
          </Section>
        )}

        {/* 6 — Participants & attendance */}
        <Section title="شرکت‌کنندگان" icon="people">
          <div className="space-y-4">
            <AttendanceGroup label="حاضرین" people={attended} emptyText="حاضری ثبت نشده است." />
            {absent.length > 0 && <AttendanceGroup label="غایبین" people={absent} emptyText="" muted />}
          </div>
        </Section>

        {/* Recorded responses so far */}
        {recorded.length > 0 && (
          <Section title="وضعیت بازبینی" icon="approval">
            <ul className="space-y-2.5">
              {recorded.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 rounded-lg border border-border px-4 py-3">
                  <span className="min-w-0">
                    <span className="block truncate text-sm">{s.approverName}</span>
                    {s.signedAt && <span className="block text-xs text-muted-foreground">{faDate(s.signedAt)}</span>}
                  </span>
                  <ApprovalBadge value={s.status} />
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Review action area */}
        {isApproved ? (
          <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            این جلسه تأیید نهایی شده است و امکان ثبت پاسخ تازه وجود ندارد.
          </div>
        ) : (
          <ReviewPanel meetingId={meeting.id} participants={panelParticipants} decisions={panelDecisions} />
        )}
      </main>
    </ReviewShell>
  );
}

function Section({
  title,
  icon,
  count,
  description,
  children,
}: {
  title: string;
  icon: Parameters<typeof AppIcon>[0]["name"];
  count?: number;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-label={title}>
      <div className="mb-3 flex items-center gap-2">
        <AppIcon name={icon} size={18} className="text-muted-foreground" />
        <h2 className="text-base font-semibold">{title}</h2>
        {typeof count === "number" && count > 0 && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{toFa(count)}</span>
        )}
      </div>
      {description && <p className="mb-3 text-sm text-muted-foreground">{description}</p>}
      {children}
    </section>
  );
}

function AttendanceGroup({
  label,
  people,
  emptyText,
  muted = false,
}: {
  label: string;
  people: Array<ReturnType<typeof getPerson>>;
  emptyText: string;
  muted?: boolean;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-muted-foreground">{label}</p>
      {people.length === 0 ? (
        emptyText ? <p className="text-sm text-muted-foreground">{emptyText}</p> : null
      ) : (
        <div className="flex flex-wrap gap-2">
          {people.map((p) =>
            p ? (
              <span
                key={p.id}
                className={
                  "inline-flex items-center gap-2 rounded-full border border-border py-1 pe-3 ps-1 text-sm " +
                  (muted ? "text-muted-foreground" : "")
                }
              >
                <PersonAvatar person={p} className="h-6 w-6" />
                <span className="truncate">{p.name}</span>
                <span className="text-xs text-muted-foreground">{roleLabels[p.role]}</span>
              </span>
            ) : null,
          )}
        </div>
      )}
    </div>
  );
}

function ReviewShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <BrandMark />
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted-foreground sm:inline">بازبینی جلسه</span>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <div className="px-4">{children}</div>
    </div>
  );
}
