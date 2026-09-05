import Link from "next/link";
import { PageHeader, SectionHeader } from "@/components/domain/page-header";
import { MetricTile } from "@/features/shared/metric-tile";
import { ProjectCard } from "@/features/projects/project-card";
import { EmptyState } from "@/components/domain/empty-state";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/icon";
import { faDate, faRelative, toFa, daysUntil } from "@/lib/utils";
import { getProjects, getActivities, getPerson, getBlockers, getProjectStats } from "@/lib/queries";
import { activityLabels } from "@/lib/labels";

export default function DashboardPage() {
  const projects = getProjects();
  const active = projects.filter((p) => p.lifecycle !== "closed");
  const atRisk = active.filter((p) => p.health !== "on_track");
  const recentActivity = getActivities().slice(0, 6);

  // Cross-project attention: open blockers + upcoming/overdue milestones.
  const attention = active
    .flatMap((p) =>
      getBlockers(p.id)
        .filter((b) => b.status === "open")
        .map((b) => ({ project: p, blocker: b })),
    )
    .slice(0, 5);

  const upcoming = active
    .flatMap((p) => p.milestones.filter((m) => m.status !== "done").map((m) => ({ project: p, milestone: m })))
    .sort((a, b) => (a.milestone.dueDate < b.milestone.dueDate ? -1 : 1))
    .slice(0, 5);

  const awaitingSignatures = active.reduce((n, p) => n + getProjectStats(p.id).meetingsAwaitingSignature, 0);

  return (
    <>
      <PageHeader
        title="داشبورد"
        description="نمای کلی پروژه‌های فعال، سلامت آن‌ها و مواردی که نیازمند توجه شماست."
        actions={
          <Button asChild>
            <Link href="/projects/new">
              <AppIcon name="add" size={18} />
              پروژهٔ جدید
            </Link>
          </Button>
        }
      />

      <section aria-label="شاخص‌های کلی" className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricTile label="پروژه‌های فعال" value={toFa(active.length)} icon="projects" tone="primary" />
        <MetricTile label="در معرض خطر یا خارج از مسیر" value={toFa(atRisk.length)} icon="risk" tone={atRisk.length ? "warning" : "success"} />
        <MetricTile
          label="موانع فعال"
          value={toFa(attention.length)}
          icon="blocker"
          tone={attention.length ? "danger" : "success"}
        />
        <MetricTile
          label="جلسات در انتظار امضا"
          value={toFa(awaitingSignatures)}
          icon="approval"
          tone={awaitingSignatures ? "warning" : "success"}
        />
      </section>

      <div className="grid gap-8 lg:grid-cols-3">
        <section aria-label="پروژه‌ها" className="lg:col-span-2">
          <SectionHeader title="پروژه‌های فعال" icon="projects" description="مرتب‌شده بر اساس آخرین به‌روزرسانی" />
          {active.length === 0 ? (
            <EmptyState
              icon="projects"
              title="هنوز پروژه‌ای ثبت نشده است"
              description="برای شروع، نخستین پروژهٔ خود را ایجاد کنید."
              action={
                <Button asChild size="sm">
                  <Link href="/projects/new">ایجاد پروژه</Link>
                </Button>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {active.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </section>

        <div className="space-y-8">
          <section aria-label="نیازمند توجه">
            <SectionHeader title="نیازمند توجه" icon="blocker" />
            {attention.length === 0 ? (
              <EmptyState icon="check" title="مانع فعالی وجود ندارد" />
            ) : (
              <Card className="divide-y divide-border">
                {attention.map(({ project, blocker }) => (
                  <Link
                    key={blocker.id}
                    href={`/projects/${project.id}/risks`}
                    className="flex items-start gap-3 p-3 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <AppIcon name="blocker" size={18} className="mt-0.5 shrink-0 text-destructive-text" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{blocker.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {project.name} · {getPerson(blocker.ownerId)?.name ?? "بدون مسئول"}
                      </p>
                    </div>
                  </Link>
                ))}
              </Card>
            )}
          </section>

          <section aria-label="نقاط‌عطف پیش‌رو">
            <SectionHeader title="نقاط‌عطف پیش‌رو" icon="milestone" />
            {upcoming.length === 0 ? (
              <EmptyState icon="milestone" title="نقطه‌عطف پیش‌رویی نیست" />
            ) : (
              <Card className="divide-y divide-border">
                {upcoming.map(({ project, milestone }) => {
                  const d = daysUntil(milestone.dueDate);
                  return (
                    <Link
                      key={milestone.id}
                      href={`/projects/${project.id}`}
                      className="flex items-center justify-between gap-3 p-3 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{milestone.title}</p>
                        <p className="text-xs text-muted-foreground">{project.name}</p>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">{faDate(milestone.dueDate)}</span>
                    </Link>
                  );
                })}
              </Card>
            )}
          </section>
        </div>
      </div>

      <section aria-label="آخرین تغییرات" className="mt-8">
        <SectionHeader
          title="آخرین تغییرات"
          icon="activity"
          actions={
            <Button asChild variant="ghost" size="sm">
              <Link href="/activity">مشاهدهٔ همه</Link>
            </Button>
          }
        />
        <Card className="divide-y divide-border">
          {recentActivity.map((a) => (
            <div key={a.id} className="flex items-center gap-3 p-3 text-sm">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <AppIcon name="activity" size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate">
                  <span className="font-medium">{a.actorName}</span>{" "}
                  <span className="text-muted-foreground">— {activityLabels[a.type]}</span>
                  {a.entityLabel ? <span className="text-muted-foreground">: {a.entityLabel}</span> : null}
                </p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">{faRelative(a.createdAt)}</span>
            </div>
          ))}
        </Card>
      </section>
    </>
  );
}
