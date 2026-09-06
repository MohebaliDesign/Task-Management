import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/icon";
import { SectionHeader } from "@/components/domain/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { MetricTile } from "@/features/shared/metric-tile";
import { HealthCheckGrid } from "@/features/projects/health-check-grid";
import { MilestoneRow } from "@/features/projects/milestone-row";
import { WorkstreamRow } from "@/features/projects/workstream-row";
import { HealthBadge, RiskLevelBadge } from "@/components/domain/status";
import { PersonChip } from "@/components/domain/person";
import { faDate, toFa } from "@/lib/utils";
import {
  getProject,
  getPerson,
  getDecisions,
  getRisks,
  getBlockers,
} from "@/lib/queries";

export default function OverviewPage({ params }: { params: { projectId: string } }) {
  const project = getProject(params.projectId);
  if (!project) notFound();

  const decisions = getDecisions(project.id).slice(0, 4);
  const risks = getRisks(project.id).filter((r) => r.status !== "resolved").slice(0, 4);
  const blockers = getBlockers(project.id).filter((b) => b.status === "open");
  const milestones = project.milestones.slice(0, 4);
  const workstreams = project.workstreams.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Tier 1 — current state */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AppIcon name="overview" size={18} className="text-muted-foreground" />
              وضعیت فعلی
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-7 text-foreground-alt">{project.executiveSummary}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-md bg-muted/50 p-3">
                <p className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <AppIcon name="flag" size={14} /> تمرکز فعلی
                </p>
                <p className="text-sm">{project.currentFocus || "—"}</p>
              </div>
              <div className="rounded-md bg-muted/50 p-3">
                <p className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <AppIcon name="milestone" size={14} /> نقطه‌عطف بعدی
                </p>
                <p className="text-sm">{project.nextMilestone || "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>پیشرفت</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">تکمیل کلی</span>
                <span className="font-semibold">{toFa(project.completion)}٪</span>
              </div>
              <Progress value={project.completion} />
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
              <span className="text-muted-foreground">سلامت کلی</span>
              <HealthBadge value={project.health} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">شروع</span>
              <span>{faDate(project.startDate)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">مهلت هدف</span>
              <span>{faDate(project.targetDate)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tier 2 — health check */}
      <section>
        <SectionHeader title="بررسی سلامت" icon="verify" description="وضعیت هر بُعد پروژه به‌صورت جداگانه" />
        <HealthCheckGrid health={project.healthCheck} />
      </section>

      {/* Metrics */}
      {project.metrics.length > 0 && (
        <section>
          <SectionHeader title="شاخص‌های کلیدی" icon="metric" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {project.metrics.map((m) => (
              <MetricTile key={m.id} label={m.label} value={m.value} hint={m.hint} />
            ))}
          </div>
        </section>
      )}

      {/* Milestones + Workstreams */}
      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <SectionHeader
            title="نقاط‌عطف"
            icon="milestone"
            actions={
              <Button asChild variant="ghost" size="sm">
                <Link href={`/projects/${project.id}/milestones`}>مشاهدهٔ همه</Link>
              </Button>
            }
          />
          {milestones.length === 0 ? (
            <EmptyState icon="milestone" title="نقطه‌عطفی ثبت نشده است" />
          ) : (
            <Card className="divide-y divide-border">
              {milestones.map((m) => <MilestoneRow key={m.id} milestone={m} />)}
            </Card>
          )}
        </section>

        <section>
          <SectionHeader
            title="جریان‌های کاری"
            icon="actions"
            actions={
              <Button asChild variant="ghost" size="sm">
                <Link href={`/projects/${project.id}/workstreams`}>مشاهدهٔ همه</Link>
              </Button>
            }
          />
          {workstreams.length === 0 ? (
            <EmptyState icon="actions" title="جریان کاری ثبت نشده است" />
          ) : (
            <Card className="divide-y divide-border">
              {workstreams.map((w) => <WorkstreamRow key={w.id} workstream={w} lead={getPerson(w.lead)} />)}
            </Card>
          )}
        </section>
      </div>

      {/* Risks / Blockers / Decisions summary */}
      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <SectionHeader
            title="ریسک‌ها و موانع"
            icon="risk"
            actions={
              <Button asChild variant="ghost" size="sm">
                <Link href={`/projects/${project.id}/risks`}>مشاهدهٔ همه</Link>
              </Button>
            }
          />
          <Card className="divide-y divide-border">
            {blockers.length === 0 && risks.length === 0 && (
              <div className="p-4">
                <EmptyState icon="check" title="ریسک یا مانع فعالی نیست" />
              </div>
            )}
            {blockers.map((b) => (
              <div key={b.id} className="flex items-start gap-3 p-3">
                <AppIcon name="blocker" size={18} className="mt-0.5 shrink-0 text-destructive-text" />
                <div className="min-w-0">
                  <p className="text-sm font-medium">{b.title}</p>
                  <p className="text-xs text-muted-foreground">مانع فعال · {getPerson(b.ownerId)?.name ?? "بدون مسئول"}</p>
                </div>
              </div>
            ))}
            {risks.map((r) => (
              <div key={r.id} className="flex items-start gap-3 p-3">
                <AppIcon name="risk" size={18} className="mt-0.5 shrink-0 text-warning" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{r.title}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <RiskLevelBadge value={r.impact} prefix="اثر" />
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </section>

        <section>
          <SectionHeader
            title="تصمیم‌های اخیر"
            icon="decision"
            actions={
              <Button asChild variant="ghost" size="sm">
                <Link href={`/projects/${project.id}/decisions`}>مشاهدهٔ همه</Link>
              </Button>
            }
          />
          {decisions.length === 0 ? (
            <EmptyState icon="decision" title="تصمیمی ثبت نشده است" />
          ) : (
            <Card className="divide-y divide-border">
              {decisions.map((d) => (
                <div key={d.id} className="flex items-start gap-3 p-3">
                  <AppIcon name="decision" size={18} className="mt-0.5 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="text-sm">{d.text}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {getPerson(d.deciderId)?.name} · {faDate(d.date)} · {d.area}
                    </p>
                  </div>
                </div>
              ))}
            </Card>
          )}
        </section>
      </div>

      {/* Team + links */}
      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <SectionHeader title="تیم" icon="people" />
          <Card className="divide-y divide-border">
            {[project.pmId, project.poId, ...project.teamIds]
              .filter((v, i, a) => a.indexOf(v) === i)
              .map((id) => (
                <div key={id} className="p-3">
                  <PersonChip person={getPerson(id)} showRole />
                </div>
              ))}
          </Card>
        </section>
        <section>
          <SectionHeader title="پیوندهای مهم" icon="link" />
          {project.links.length === 0 ? (
            <EmptyState icon="link" title="پیوندی ثبت نشده است" />
          ) : (
            <Card className="divide-y divide-border">
              {project.links.map((l) => (
                <a
                  key={l.id}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 p-3 text-sm transition-colors hover:bg-muted/50"
                >
                  <span className="flex items-center gap-2">
                    <AppIcon name="link" size={16} className="text-muted-foreground" />
                    {l.label}
                  </span>
                  <span className="ltr truncate text-xs text-muted-foreground">{l.url}</span>
                </a>
              ))}
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}
