import Link from "next/link";
import { AppIcon, type IconName } from "@/components/icon";
import { activityLabels } from "@/lib/labels";
import { faDate } from "@/lib/utils";
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
  comment_added: "comment",
  signature_added: "approval",
  ceo_approval: "verify",
  project_closed: "archive",
};

function ProjectAvatar({ name }: { name: string }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
      {name.slice(0, 2)}
    </span>
  );
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
  return (
    <ol className="space-y-3">
      {activities.map((a) => {
        const project = projectName?.(a.projectId);

        return (
          <li key={a.id} className="rounded-xl border border-border/70 bg-card p-4">
            <div className="flex items-center gap-3">
              {project && <ProjectAvatar name={project} />}
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <AppIcon name={iconFor[a.type]} size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <span className="font-medium">{a.actorName}</span>{" "}
                  <span className="text-muted-foreground">{activityLabels[a.type]}</span>
                </p>
                {a.entityLabel && <p className="mt-1 text-sm text-foreground">{a.entityLabel}</p>}
              </div>
              <span className="text-xs text-muted-foreground" title={faDate(a.createdAt, true)}>
                {faDate(a.createdAt)}
              </span>
            </div>

            {(a.previousValue || a.newValue) && (
              <p className="mt-3 text-xs text-muted-foreground">
                {a.previousValue && <span className="line-through">{a.previousValue}</span>}
                {a.previousValue && a.newValue && <span className="mx-1">←</span>}
                {a.newValue && <span className="text-foreground">{a.newValue}</span>}
              </p>
            )}

            {showProjectLink && project && (
              <div className="mt-3 flex gap-3 text-xs text-muted-foreground">
                <Link href={`/projects/${a.projectId}`} className="hover:text-foreground">
                  {project}
                </Link>
                {a.meetingId && (
                  <Link href={`/projects/${a.projectId}/meetings/${a.meetingId}`} className="hover:text-foreground">
                    مشاهده جلسه
                  </Link>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
