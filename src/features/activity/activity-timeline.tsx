import Link from "next/link";
import { Card } from "@/components/ui/card";
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
    <Card className="divide-y divide-border">
      {activities.map((a) => {
        const project = projectName?.(a.projectId);

        return (
          <div key={a.id} className="flex items-start gap-3 p-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <AppIcon name={iconFor[a.type]} size={16} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm">
                <span className="font-medium">{a.actorName}</span>{" "}
                <span className="text-muted-foreground">{activityLabels[a.type]}</span>
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                {a.entityLabel && <span className="max-w-xs truncate text-foreground">{a.entityLabel}</span>}
                {(a.previousValue || a.newValue) && (
                  <span className="flex items-center gap-1">
                    {a.previousValue && <span className="line-through">{a.previousValue}</span>}
                    {a.previousValue && a.newValue && <span>←</span>}
                    {a.newValue && <span className="text-foreground">{a.newValue}</span>}
                  </span>
                )}
                {showProjectLink && project && (
                  <Link href={`/projects/${a.projectId}`} className="hover:text-foreground">
                    {project}
                  </Link>
                )}
                {showProjectLink && a.meetingId && (
                  <Link href={`/projects/${a.projectId}/meetings/${a.meetingId}`} className="hover:text-foreground">
                    مشاهدهٔ جلسه
                  </Link>
                )}
              </div>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground" title={faDate(a.createdAt, true)}>
              {faDate(a.createdAt)}
            </span>
          </div>
        );
      })}
    </Card>
  );
}
