import "server-only";
import { getMeeting, getMeetingContext, getProject } from "@/lib/queries";
import type { Activity } from "@/lib/domain";

/**
 * Resolves the "مشاهده جزئیات" destination for an event, or null when the
 * affected entity (or its owning project) no longer resolves — item #59
 * requires no broken link ever be shown for a deleted target. Kept separate
 * from activity-meta.ts (pure data, importable from the client toolbar) since
 * this touches the server-only data layer.
 */
export function resolveActivityTarget(a: Activity): string | null {
  const project = getProject(a.projectId);
  if (!project) return null;

  if (a.meetingId) {
    const meeting = getMeeting(a.meetingId);
    if (meeting) return getMeetingContext(meeting).meetingHref;
  }

  switch (a.type) {
    case "action_status_changed":
    case "action_owner_changed":
    case "blocker_status_changed":
    case "dependency_added":
    case "risk_added":
      return `/projects/${project.id}/actions`;
    case "decision_added":
      return `/projects/${project.id}/decisions`;
    case "milestone_updated":
      return `/projects/${project.id}/milestones`;
    case "person_added":
      return "/people";
    default:
      return `/projects/${project.id}`;
  }
}
