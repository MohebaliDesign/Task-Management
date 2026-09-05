import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/icon";
import { BrandMark } from "@/components/layout/brand-mark";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { EmptyState } from "@/components/domain/empty-state";
import { HealthBadge, LifecycleBadge } from "@/components/domain/status";
import { CloseProjectForm } from "@/features/review/close-project-form";
import {
  getProject, getDecisions, getActions, getBlockers, getMeetings, getProjectApproval, getPerson,
} from "@/lib/queries";
import { faDate, toFa } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function FinalReviewPage({ params }: { params: { projectId: string } }) {
  const project = getProject(params.projectId);

  if (!project) {
    return (
      <FinalReviewShell>
        <div className="mx-auto max-w-md py-16">
          <EmptyState icon="info" title="پروژه یافت نشد" description="این پیوند معتبر نیست." />
        </div>
      </FinalReviewShell>
    );
  }

  const decisions = getDecisions(project.id);
  const openActions = getActions(project.id).filter((a) => a.status !== "done" && a.status !== "canceled");
  const openBlockers = getBlockers(project.id).filter((b) => b.status === "open");
  const meetings = getMeetings(project.id);
  const approval = getProjectApproval(project.id);
  const closed = project.lifecycle === "closed";

  return (
    <FinalReviewShell>
      <div className="mx-auto max-w-3xl space-y-6 py-8">
        <div>
          <p className="text-sm text-muted-foreground">بازبینی نهایی پروژه</p>
          <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-2xl font-semibold">{project.name} — {project.versionLabel}</h1>
            <div className="flex items-center gap-2">
              <HealthBadge value={project.health} />
              <LifecycleBadge value={project.lifecycle} />
            </div>
          </div>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">خلاصهٔ پروژه</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-7 text-foreground-alt">{project.executiveSummary}</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Stat label="پیشرفت نهایی" value={`${toFa(project.completion)}٪`} />
              <Stat label="جلسات" value={toFa(meetings.length)} />
              <Stat label="تصمیم‌ها" value={toFa(decisions.length)} />
              <Stat label="مدیر پروژه" value={getPerson(project.pmId)?.name ?? "—"} />
            </div>
            <Progress value={project.completion} />
          </CardContent>
        </Card>

        {/* Outstanding issues */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><AppIcon name="blocker" size={18} className="text-warning" />موارد باز</CardTitle></CardHeader>
          <CardContent>
            {openActions.length === 0 && openBlockers.length === 0 ? (
              <p className="flex items-center gap-2 text-sm text-success"><AppIcon name="check" size={16} /> موردی باز نمانده است.</p>
            ) : (
              <ul className="space-y-1.5 text-sm">
                {openBlockers.map((b) => <li key={b.id} className="flex items-start gap-2"><AppIcon name="blocker" size={15} className="mt-0.5 shrink-0 text-destructive-text" />{b.title}</li>)}
                {openActions.map((a) => <li key={a.id} className="flex items-start gap-2 text-muted-foreground"><AppIcon name="actions" size={15} className="mt-0.5 shrink-0" />{a.title}</li>)}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Key decisions */}
        {decisions.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><AppIcon name="decision" size={18} className="text-primary" />تصمیم‌های کلیدی</CardTitle></CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                {decisions.slice(0, 6).map((d) => (
                  <li key={d.id} className="p-4 text-sm">{d.text}<span className="mt-1 block text-xs text-muted-foreground">{faDate(d.date)}</span></li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* CEO sign-off */}
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AppIcon name="verify" size={18} className="text-primary" variant="Bold" />
              تأیید نهایی مدیرعامل
            </CardTitle>
          </CardHeader>
          <CardContent>
            {closed && approval ? (
              <div className="space-y-3">
                <div className="rounded-md border border-success/20 bg-success-subtle p-3 text-sm text-success">
                  <p className="flex items-center gap-2 font-medium"><AppIcon name="approval" size={16} /> تأییدشده توسط {approval.approverName}</p>
                  <p className="mt-1 text-xs">{faDate(approval.signedAt, true)}</p>
                </div>
                {project.finalResult && <div className="rounded-md bg-muted/50 p-3 text-sm"><p className="font-medium">نتیجهٔ نهایی</p><p className="mt-1 text-muted-foreground">{project.finalResult}</p></div>}
                <Button asChild variant="outline"><Link href={`/projects/${project.id}`}>بازگشت به پروژه</Link></Button>
              </div>
            ) : (
              <CloseProjectForm projectId={project.id} defaultResult={project.finalResult ?? undefined} />
            )}
          </CardContent>
        </Card>
      </div>
    </FinalReviewShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-muted/50 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}

function FinalReviewShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <BrandMark />
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted-foreground sm:inline">بازبینی نهایی</span>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <div className="px-4">{children}</div>
    </div>
  );
}
