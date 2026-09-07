import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { AppIcon } from "@/components/icon";
import { HealthBadge, LifecycleBadge, PhaseBadge, PriorityBadge } from "@/components/domain/status";
import { PersonChip } from "@/components/domain/person";
import { faDate, toFa } from "@/lib/utils";
import { getPerson } from "@/lib/queries";
import type { Project } from "@/lib/domain";

export function ProjectHeader({ project }: { project: Project }) {
  const pm = getPerson(project.pmId);
  const po = getPerson(project.poId);
  const prev = project.previousVersionId;

  return (
    <div className="mb-8">
      <nav
        aria-label="مسیر"
        className="mb-3 flex items-center gap-1 text-sm text-muted-foreground"
      >
        <Link
          href="/projects"
          className="rounded-sm hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          پروژه‌ها
        </Link>

        <AppIcon name="chevronLeft" size={14} className="opacity-50" />

        <span className="text-foreground">{project.name}</span>
      </nav>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="break-words text-2xl font-semibold tracking-tight">
              {project.name}
            </h1>

            <span className="rounded-md bg-muted px-2 py-0.5 text-sm text-muted-foreground">
              {project.versionLabel}
            </span>

            {prev && (
              <Link
                href={`/projects/${prev}`}
                className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <AppIcon name="archive" size={13} />
                نسخهٔ پیشین
              </Link>
            )}
          </div>

          <p className="mt-4 max-w-2xl text-lg leading-7 text-muted-foreground">
            {project.statusSummary}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <HealthBadge value={project.health} />
            <LifecycleBadge value={project.lifecycle} />
            <PhaseBadge value={project.phase} />
            <PriorityBadge value={project.priority} />
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 lg:w-80">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">پیشرفت</span>
              <span className="font-semibold">
                {toFa(project.completion)}٪
              </span>
            </div>

            <Progress value={project.completion} className="h-1.5" />
          </div>

          <div className="space-y-2.5 border-t border-border pt-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">تاریخ شروع</span>
              <span>{faDate(project.startDate)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">مهلت هدف</span>
              <span>{faDate(project.targetDate)}</span>
            </div>
          </div>

          <div className="space-y-2.5 border-t border-border pt-4 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">مدیر پروژه</span>
              <PersonChip person={pm} />
            </div>

            {po && (
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">مالک محصول</span>
                <PersonChip person={po} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}