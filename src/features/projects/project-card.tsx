import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AppIcon } from "@/components/icon";
import { HealthBadge, LifecycleBadge, PhaseBadge, PriorityBadge } from "@/components/domain/status";
import { AvatarStack } from "@/components/domain/person";
import { faDate, toFa, daysUntil } from "@/lib/utils";
import { getPerson, getProjectStats } from "@/lib/queries";
import type { Project } from "@/lib/domain";

export function ProjectCard({ project }: { project: Project }) {
  const pm = getPerson(project.pmId);
  const team = project.teamIds.map((id) => getPerson(id)).filter((p): p is NonNullable<typeof p> => !!p);
  const stats = getProjectStats(project.id);
  const dLeft = daysUntil(project.targetDate);
  const overdue = dLeft !== null && dLeft < 0 && project.lifecycle !== "closed";

  return (
    <Card className="group relative flex flex-col p-5 transition-shadow hover:shadow-sm">
      <Link href={`/projects/${project.id}`} className="absolute inset-0 z-10 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={`باز کردن ${project.name} ${project.versionLabel}`} />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-semibold">{project.name}</h3>
            <span className="rounded-sm bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">{project.versionLabel}</span>
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{project.statusSummary}</p>
        </div>
        <HealthBadge value={project.health} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <LifecycleBadge value={project.lifecycle} />
        <PhaseBadge value={project.phase} />
        <PriorityBadge value={project.priority} />
      </div>

      <div className="mt-4 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">پیشرفت</span>
          <span className="font-medium">{toFa(project.completion)}٪</span>
        </div>
        <Progress value={project.completion} />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <AppIcon name="calendar" size={15} />
          {project.lifecycle === "closed" ? (
            <span>بسته‌شده {faDate(project.closedDate)}</span>
          ) : (
            <span className={overdue ? "font-medium text-destructive-text" : ""}>
              مهلت {faDate(project.targetDate)}
              {dLeft !== null && (overdue ? ` (${toFa(Math.abs(dLeft))} روز تأخیر)` : ` (${toFa(dLeft)} روز مانده)`)}
            </span>
          )}
        </span>
        <AvatarStack people={pm ? [pm, ...team.filter((t) => t.id !== pm.id)] : team} />
      </div>

      {(stats.openBlockers > 0 || stats.meetingsAwaitingSignature > 0) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {stats.openBlockers > 0 && (
            <span className="inline-flex items-center gap-1 rounded-md bg-destructive-subtle px-2 py-0.5 text-xs text-destructive-text">
              <AppIcon name="blocker" size={14} />
              {toFa(stats.openBlockers)} مانع فعال
            </span>
          )}
          {stats.meetingsAwaitingSignature > 0 && (
            <span className="inline-flex items-center gap-1 rounded-md bg-warning-subtle px-2 py-0.5 text-xs text-warning">
              <AppIcon name="approval" size={14} />
              {toFa(stats.meetingsAwaitingSignature)} جلسه در انتظار امضا
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
