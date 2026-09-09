import Link from "next/link";
import { AppIcon } from "@/components/icon";
import { StatusPill } from "@/components/domain/status";
import { PersonAvatar } from "@/components/domain/person";
import { toneClasses } from "@/lib/labels";
import { faTime } from "@/lib/utils";
import { getPerson, getProject, getMeeting } from "@/lib/queries";
import { activityMeta, activityTitle, isStatusTransition } from "./activity-meta";
import { resolveActivityTarget } from "./activity-target";
import type { Activity } from "@/lib/domain";

/**
 * One compact governance event row (items #49-62): icon + title first, then
 * a single secondary line carrying context/actor/time, and the status
 * transition/description only when they add information. Never a tall card.
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
    <li className="flex gap-3 py-3">
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${toneClasses[meta.tone]}`}>
        <AppIcon name={meta.icon} size={15} />
      </span>

      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-sm font-medium leading-snug text-foreground">{activityTitle(activity.type, activity.entityLabel)}</p>

        {showTransition && (
          <div className="flex flex-wrap items-center gap-1.5">
            <StatusPill label={activity.previousValue!} tone="muted" dot={false} />
            <AppIcon name="chevronLeft" size={12} className="text-muted-foreground" />
            <StatusPill label={activity.newValue!} tone="primary" dot={false} />
          </div>
        )}
        {hasFreeformDiff && (
          <p className="text-xs text-muted-foreground">
            {activity.previousValue && <span className="line-through">{activity.previousValue}</span>}
            {activity.previousValue && activity.newValue && <span className="mx-1">←</span>}
            {activity.newValue && <span className="text-foreground">{activity.newValue}</span>}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {actor && (
            <span className="inline-flex items-center gap-1.5">
              <PersonAvatar person={actor} className="h-5 w-5" />
              {actor.name}
            </span>
          )}
          {project && (
            <Link href={`/projects/${project.id}`} className="inline-flex items-center gap-1 hover:text-foreground">
              <AppIcon name="projects" size={12} />
              {project.name}
            </Link>
          )}
          {meeting && (
            <span className="inline-flex items-center gap-1">
              <AppIcon name="meetings" size={12} />
              {meeting.title}
            </span>
          )}
          <span className="ltr">{faTime(activity.createdAt)}</span>
          {href && (
            <Link href={href} className="ms-auto shrink-0 font-medium text-primary hover:underline">
              مشاهده جزئیات
            </Link>
          )}
        </div>
      </div>
    </li>
  );
}
