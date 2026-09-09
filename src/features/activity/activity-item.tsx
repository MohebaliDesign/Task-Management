import Link from "next/link";
import { AppIcon } from "@/components/icon";
import { StatusPill } from "@/components/domain/status";
import { PersonAvatar } from "@/components/domain/person";
import { toneClasses } from "@/lib/labels";
import { cn, faTime } from "@/lib/utils";
import { getPerson, getProject, getMeeting } from "@/lib/queries";
import { activityMeta, activityTitle, isStatusTransition } from "./activity-meta";
import { resolveActivityTarget } from "./activity-target";
import type { Activity } from "@/lib/domain";

/**
 * One governance event row. Hierarchy top to bottom: Title (dominant) →
 * status transition / short diff (quiet, only when real) → Context
 * breadcrumb (quiet) → Actor + Time group, with the "مشاهده جزئیات" action
 * aligned consistently at the end of that same row. Never a card — a
 * lightweight row with generous vertical breathing room instead.
 */
export function ActivityItem({ activity, showProjectContext = true }: { activity: Activity; showProjectContext?: boolean }) {
  const meta = activityMeta[activity.type];
  const actor = getPerson(activity.actorId);
  const project = showProjectContext ? getProject(activity.projectId) : undefined;
  const meeting = activity.meetingId ? getMeeting(activity.meetingId) : undefined;
  const href = resolveActivityTarget(activity);
  const showTransition = isStatusTransition(activity);
  const hasFreeformDiff = !showTransition && !!(activity.previousValue || activity.newValue);

  return (
    <li className="flex gap-3 py-4">
      <span className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full", toneClasses[meta.tone], "border-transparent")}>
        <AppIcon name={meta.icon} size={15} />
      </span>

      <div className="min-w-0 flex-1 space-y-2">
        <p className="text-sm font-semibold leading-snug text-foreground">{activityTitle(activity.type, activity.entityLabel)}</p>

        {showTransition && (
          <div className="flex flex-wrap items-center gap-1.5">
            <StatusPill label={activity.previousValue!} tone="muted" dot={false} />
            <AppIcon name="chevronLeft" size={12} className="text-muted-foreground" />
            <StatusPill label={activity.newValue!} tone="primary" dot={false} />
          </div>
        )}
        {hasFreeformDiff && (
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {activity.previousValue && <span className="line-through">{activity.previousValue}</span>}
            {activity.previousValue && activity.newValue && <span className="mx-1">←</span>}
            {activity.newValue && <span className="text-foreground/80">{activity.newValue}</span>}
          </p>
        )}

        {(project || meeting) && (
          <p className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
            {project && (
              <Link href={`/projects/${project.id}`} className="truncate hover:text-foreground">
                {project.name}
              </Link>
            )}
            {project && meeting && <AppIcon name="chevronLeft" size={10} className="shrink-0 opacity-60" />}
            {meeting && <span className="truncate">{meeting.title}</span>}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {actor && (
              <>
                <PersonAvatar person={actor} className="h-5 w-5" />
                <span>{actor.name}</span>
                <span aria-hidden="true">·</span>
              </>
            )}
            <span className="ltr">{faTime(activity.createdAt)}</span>
          </p>
          {href && (
            <Link href={href} className="flex shrink-0 items-center gap-1 text-xs font-medium text-primary hover:underline">
              مشاهده جزئیات
              <AppIcon name="chevronLeft" size={14} />
            </Link>
          )}
        </div>
      </div>
    </li>
  );
}
