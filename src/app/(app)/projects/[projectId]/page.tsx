import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/icon";
import { SectionHeader } from "@/components/domain/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { MetricTile } from "@/features/shared/metric-tile";
import { TeamWorkstreams } from "@/features/projects/team-workstreams";
import { ProjectResources } from "@/features/projects/project-resources";
import { DecisionCard } from "@/features/decisions/decision-card";
import { MilestoneStatusBadge, PhaseBadge, PriorityBadge } from "@/components/domain/status";
import { faDate, toFa } from "@/lib/utils";
import { getProject, getDecisions } from "@/lib/queries";

export default function OverviewPage({ params }: { params: { projectId: string } }) {
  const project = getProject(params.projectId);
  if (!project) notFound();

  const allDecisions = getDecisions(project.id);
  const decisions = allDecisions.slice(0, 4);
  const upcomingMilestone = [...project.milestones]
    .filter((m) => m.status !== "done")
    .sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1))[0];

  const rosterCount = [project.pmId, project.poId, ...project.teamIds].filter(
    (id, i, all): id is string => !!id && all.indexOf(id) === i,
  ).length;
  const milestonesDone = project.milestones.filter((m) => m.status === "done").length;

  return (
    <div className="space-y-8">
      {/* Overview statistics — a quick-glance summary, no title by design */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricTile icon="people" label="اعضای تیم" value={toFa(rosterCount)} hint="نفر مسئول در این پروژه" />
        <MetricTile
          icon="milestone"
          label="نقاط عطف"
          value={project.milestones.length > 0 ? `${toFa(milestonesDone)} از ${toFa(project.milestones.length)}` : "—"}
          hint="نقطهٔ عطف تکمیل‌شده"
        />
        <MetricTile icon="decision" label="تصمیم‌های ثبت‌شده" value={toFa(allDecisions.length)} hint="تصمیم مستندشده در این پروژه" />
        <MetricTile icon="link" label="منابع پروژه" value={toFa(project.resources.length)} hint="منبع مرتبط ثبت‌شده" />
      </div>

      {/* 2 — خلاصه پروژه */}
      <section>
        <SectionHeader title="خلاصه پروژه" icon="overview" />
        <Card>
          <CardContent className="p-4">
            {project.executiveSummary ? (
              <p className="text-sm leading-7 text-foreground-alt">{project.executiveSummary}</p>
            ) : (
              <p className="text-sm text-muted-foreground">خلاصه‌ای برای این پروژه ثبت نشده است.</p>
            )}
          </CardContent>
        </Card>
      </section>

      {/* 3 — وضعیت فعلی پروژه */}
      <section>
        <SectionHeader title="وضعیت فعلی پروژه" icon="flag" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">تمرکز فعلی</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <PriorityBadge value={project.priority} />
                <PhaseBadge value={project.phase} />
              </div>
              <p className="text-sm leading-7">{project.currentFocus || "تمرکز فعلی ثبت نشده است."}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">نقطه عطف بعدی</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm leading-7">{project.nextMilestone || "نقطه‌عطف بعدی ثبت نشده است."}</p>
              {upcomingMilestone && (
                <div className="border-t border-border pt-3">
                  <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <AppIcon name="milestone" size={14} />
                      نزدیک‌ترین نقطه‌عطف برنامه‌ریزی‌شده: {upcomingMilestone.title}
                    </span>
                    <span>{faDate(upcomingMilestone.dueDate)}</span>
                  </div>
                  <Progress value={upcomingMilestone.progress} className="mt-2 h-1.5" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 4 — نقاط عطف و مسیر پیشرفت */}
<section className="space-y-4">
  <SectionHeader title="نقاط عطف و مسیر پیشرفت" icon="milestone" />

  {project.milestones.length === 0 ? (
    <EmptyState icon="milestone" title="نقطه‌عطفی ثبت نشده است" />
  ) : (
    <Card className="divide-y divide-border">
      {project.milestones.map((m) => (
        <div key={m.id} className="p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium">{m.title}</p>
            <MilestoneStatusBadge value={m.status} />
          </div>

          <div className="mt-2 flex items-center gap-3">
            <Progress value={m.progress} className="h-1.5" />

            <span className="shrink-0 text-xs text-muted-foreground">
              {faDate(m.dueDate)}
            </span>
          </div>
        </div>
      ))}
    </Card>
  )}
</section>

      {/* 5 — تیم و جریان‌های کاری */}
      <section>
        <SectionHeader title="تیم و جریان‌های کاری" icon="people" description="اینکه چه کسی مسئول چه کاری است و کارش تا کجا پیش رفته." />
        <TeamWorkstreams project={project} />
      </section>

      {/* 6 — تصمیم‌های اخیر */}
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
          <div className="grid items-start gap-4 sm:grid-cols-2">
            {decisions.map((d) => (
              <DecisionCard key={d.id} decision={d} projectId={project.id} />
            ))}
          </div>
        )}
      </section>

      {/* 7 — منابع پروژه */}
      <section>
        <SectionHeader title="منابع پروژه" icon="link" />
        <ProjectResources resources={project.resources} />
      </section>
    </div>
  );
}
