import Link from "next/link";
import { PageHeader, SectionHeader } from "@/components/domain/page-header";
import { MetricTile } from "@/features/shared/metric-tile";
import { ProjectCard } from "@/features/projects/project-card";
import { MeetingSpaceCard } from "@/features/meeting-spaces/meeting-space-card";
import { EmptyState } from "@/components/domain/empty-state";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/icon";
import { faRelative, toFa } from "@/lib/utils";
import { getProjects, getActivities, getBlockers, getProjectStats, getMeetingSpaces } from "@/lib/queries";
import { activityLabels } from "@/lib/labels";

export default function DashboardPage() {
  const projects = getProjects();
  const active = projects.filter((p) => p.lifecycle !== "closed");
  const atRisk = active.filter((p) => p.health !== "on_track");
  const recentActivity = getActivities().slice(0, 6);
  const meetingSpaces = getMeetingSpaces();

  const openBlockersCount = active.reduce(
    (n, p) => n + getBlockers(p.id).filter((b) => b.status === "open").length,
    0,
  );
  const awaitingSignatures = active.reduce((n, p) => n + getProjectStats(p.id).meetingsAwaitingSignature, 0);

  return (
    <>
      <PageHeader
        title="داشبورد"
        description="نمای کلی پروژه‌های فعال، سلامت آن‌ها و مواردی که نیازمند توجه شماست."
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/meetings/new">
                <AppIcon name="add" size={18} />
                ایجاد دسته جلسات
              </Link>
            </Button>
            <Button asChild>
              <Link href="/projects/new">
                <AppIcon name="add" size={18} />
                ایجاد پروژه
              </Link>
            </Button>
          </>
        }
      />

      <section aria-label="شاخص‌های کلی" className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricTile label="پروژه‌های فعال" value={toFa(active.length)} icon="projects" tone="primary" />
        <MetricTile label="در معرض خطر یا خارج از مسیر" value={toFa(atRisk.length)} icon="risk" tone={atRisk.length ? "warning" : "success"} />
        <MetricTile
          label="موانع فعال"
          value={toFa(openBlockersCount)}
          icon="blocker"
          tone={openBlockersCount ? "danger" : "success"}
        />
        <MetricTile
          label="جلسات در انتظار امضا"
          value={toFa(awaitingSignatures)}
          icon="approval"
          tone={awaitingSignatures ? "warning" : "success"}
        />
      </section>

      <section aria-label="پروژه‌ها" className="mb-8">
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
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {active.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </section>

      <section aria-label="دسته‌های جلسات" className="mb-8">
        <SectionHeader
          title="دسته‌های جلسات"
          icon="meetings"
          description="جلسات سازمانی مستقل از پروژه"
          actions={
            <Button asChild variant="ghost" size="sm">
              <Link href="/meetings">مشاهدهٔ همه</Link>
            </Button>
          }
        />
        {meetingSpaces.length === 0 ? (
          <EmptyState
            icon="meetings"
            title="هنوز دسته‌ای از جلسات ثبت نشده است"
            description="یک دسته بسازید تا جلسات سازمانی مستقل از پروژه را در آن ثبت کنید."
            action={
              <Button asChild size="sm">
                <Link href="/meetings/new">ایجاد دسته جلسات</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {meetingSpaces.map((s) => (
              <MeetingSpaceCard key={s.id} space={s} />
            ))}
          </div>
        )}
      </section>

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
