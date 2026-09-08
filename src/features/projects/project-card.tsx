import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AppIcon } from "@/components/icon";
import { HealthBadge, LifecycleBadge, PhaseBadge } from "@/components/domain/status";
import { PersonChip } from "@/components/domain/person";
import { faRelative, toFa } from "@/lib/utils";
import { getPerson } from "@/lib/queries";
import type { Project } from "@/lib/domain";

/**
 * Scannable summary only — full detail (priority, team, links, deadline,
 * blockers…) lives on the project page. Primary: name, description, status,
 * owner. Secondary: phase, progress, last update.
 */
export function ProjectCard({ project }: { project: Project }) {
  const pm = getPerson(project.pmId);

  return (
    <Card className="group relative flex flex-col p-5 shadow-sm transition-shadow hover:shadow-md">
      <Link
        href={`/projects/${project.id}`}
        className="absolute inset-0 z-10 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`مشاهدهٔ جزئیات ${project.name} ${project.versionLabel}`}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-semibold">{project.name}</h3>
            <span className="shrink-0 rounded-sm bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">{project.versionLabel}</span>
          </div>
          <p className="mt-1 truncate text-sm text-muted-foreground">{project.statusSummary || "توضیحی ثبت نشده است."}</p>
        </div>
        {project.lifecycle === "closed" ? <LifecycleBadge value={project.lifecycle} /> : <HealthBadge value={project.health} />}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>مدیر پروژه</span>
        <PersonChip person={pm} variant="compact" />
      </div>

      <div className="mt-3 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <PhaseBadge value={project.phase} />
          <span className="font-medium text-foreground">{toFa(project.completion)}٪</span>
        </div>
        <Progress value={project.completion} className="h-1.5" />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
        <span>به‌روزرسانی {faRelative(project.updatedAt)}</span>
        <span className="flex items-center gap-1 font-medium text-primary">
          مشاهدهٔ جزئیات
          <AppIcon name="chevronLeft" size={14} />
        </span>
      </div>
    </Card>
  );
}
