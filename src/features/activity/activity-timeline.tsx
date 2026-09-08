import Link from "next/link";
import { AppIcon, type IconName } from "@/components/icon";
import { activityLabels } from "@/lib/labels";
import { faDate, faTime } from "@/lib/utils";
import type { Activity, ActivityType } from "@/lib/domain";

const iconFor: Record<ActivityType, IconName> = {
  project_created: "projects",
  project_updated: "edit",
  health_changed: "verify",
  deadline_changed: "calendar",
  milestone_updated: "milestone",
  meeting_created: "meetings",
  meeting_submitted: "send",
  meeting_approved: "approval",
  decision_added: "decision",
  action_added: "actions",
  action_status_changed: "actions",
  action_owner_changed: "profile",
  dependency_added: "dependency",
  risk_added: "risk",
  blocker_added: "blocker",
  blocker_status_changed: "blocker",
  comment_added: "comment",
  signature_added: "approval",
  ceo_approval: "verify",
  project_closed: "archive",
};

/** Groups already-sorted (newest first) activities by calendar day, keyed by their formatted Persian date. */
function groupByDay(activities: Activity[]): { day: string; items: Activity[] }[] {
  const groups: { day: string; items: Activity[] }[] = [];
  for (const a of activities) {
    const day = faDate(a.createdAt);
    const last = groups[groups.length - 1];
    if (last && last.day === day) {
      last.items.push(a);
    } else {
      groups.push({ day, items: [a] });
    }
  }
  return groups;
}

export function ActivityTimeline({
  activities,
  projectName,
  showProjectLink = false,
}: {
  activities: Activity[];
  projectName?: (projectId: string) => string | undefined;
  showProjectLink?: boolean;
}) {
  const groups = groupByDay(activities);

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.day}>
          <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-foreground">
            <AppIcon name="calendar" size={13} className="text-muted-foreground" />
            {group.day}
          </p>
          <ol className="relative space-y-1">
            {group.items.map((a, i) => (
              <li key={a.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
                    <AppIcon name={iconFor[a.type]} size={16} />
                  </span>
                  {i < group.items.length - 1 && <span className="my-1 w-px flex-1 bg-border" aria-hidden="true" />}
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-sm">
                    <span className="font-medium">{a.actorName}</span>{" "}
                    <span className="text-muted-foreground">{activityLabels[a.type]}</span>
                    {a.entityLabel ? <span>: {a.entityLabel}</span> : null}
                  </p>
                  {(a.previousValue || a.newValue) && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {a.previousValue && <span className="line-through">{a.previousValue}</span>}
                      {a.previousValue && a.newValue && <span className="mx-1">←</span>}
                      {a.newValue && <span className="text-foreground">{a.newValue}</span>}
                    </p>
                  )}
                  <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{faTime(a.createdAt)}</span>
                    {showProjectLink && projectName?.(a.projectId) && (
                      <>
                        <span aria-hidden="true">·</span>
                        <Link href={`/projects/${a.projectId}`} className="hover:text-foreground">{projectName(a.projectId)}</Link>
                      </>
                    )}
                    {a.meetingId && (
                      <>
                        <span aria-hidden="true">·</span>
                        <Link href={`/projects/${a.projectId}/meetings/${a.meetingId}`} className="flex items-center gap-1 hover:text-foreground">
                          <AppIcon name="meetings" size={12} /> جلسه
                        </Link>
                      </>
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}
