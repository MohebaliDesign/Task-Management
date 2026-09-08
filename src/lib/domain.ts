/**
 * Domain model for the Project Governance & Meeting Accountability System.
 * Derived from Sources/INFORMATION_ARCHITECTURE.md (source of truth).
 *
 * Enum *values* are stable English keys (safe for storage/URLs); user-facing
 * Persian labels live in labels.ts so the data layer never mixes copy with data.
 */

// ── Enumerations ────────────────────────────────────────────────────────────
export const PROJECT_HEALTH = ["on_track", "at_risk", "off_track"] as const;
export type ProjectHealth = (typeof PROJECT_HEALTH)[number];

export const PROJECT_LIFECYCLE = [
  "draft",
  "active",
  "ready_for_review",
  "awaiting_ceo_approval",
  "closed",
] as const;
export type ProjectLifecycle = (typeof PROJECT_LIFECYCLE)[number];

export const PROJECT_PHASE = [
  "discovery",
  "design",
  "development",
  "testing",
  "launch",
  "maintenance",
] as const;
export type ProjectPhase = (typeof PROJECT_PHASE)[number];

export const PRIORITY = ["low", "medium", "high", "critical"] as const;
export type Priority = (typeof PRIORITY)[number];

export const HEALTH_DIMENSION = [
  "scope",
  "timeline",
  "resources",
  "quality",
  "dependencies",
  "risks",
  "budget",
] as const;
export type HealthDimension = (typeof HEALTH_DIMENSION)[number];

export const MEETING_STATUS = [
  "draft",
  "ready_for_review",
  "awaiting_signatures",
  "approved",
] as const;
export type MeetingStatus = (typeof MEETING_STATUS)[number];

export const ACTION_STATUS = [
  "not_started",
  "in_progress",
  "blocked",
  "done",
  "canceled",
] as const;
export type ActionStatus = (typeof ACTION_STATUS)[number];

export const APPROVAL_STATUS = [
  "pending",
  "approved",
  "feedback_submitted",
  "changes_requested",
] as const;
export type ApprovalStatus = (typeof APPROVAL_STATUS)[number];

export const RISK_LEVEL = ["low", "medium", "high"] as const;
export type RiskLevel = (typeof RISK_LEVEL)[number];

export const RISK_STATUS = ["open", "mitigating", "resolved"] as const;
export type RiskStatus = (typeof RISK_STATUS)[number];

export const BLOCKER_STATUS = ["open", "resolved"] as const;
export type BlockerStatus = (typeof BLOCKER_STATUS)[number];

export const MILESTONE_STATUS = ["planned", "in_progress", "done", "at_risk"] as const;
export type MilestoneStatus = (typeof MILESTONE_STATUS)[number];

export const RESOURCE_KIND = ["figma", "repo", "docs", "drive", "slack", "other"] as const;
export type ResourceKind = (typeof RESOURCE_KIND)[number];

export const ROLE = ["pm", "po", "team_lead", "ceo", "member"] as const;
export type Role = (typeof ROLE)[number];

export const ACTIVITY_TYPE = [
  "project_created",
  "project_updated",
  "health_changed",
  "deadline_changed",
  "milestone_updated",
  "meeting_created",
  "meeting_updated",
  "meeting_submitted",
  "meeting_approved",
  "decision_added",
  "action_added",
  "action_status_changed",
  "action_owner_changed",
  "dependency_added",
  "risk_added",
  "blocker_added",
  "blocker_status_changed",
  "comment_added",
  "signature_added",
  "ceo_approval",
  "project_closed",
  "person_added",
] as const;
export type ActivityType = (typeof ACTIVITY_TYPE)[number];

// ── Entities ────────────────────────────────────────────────────────────────
export interface Person {
  id: string;
  name: string;
  role: Role;
  title: string; // organisational title, Persian
  email: string;
  initials: string;
}

/**
 * An organizational team people belong to — distinct from `Project.teamIds`,
 * which is a project's own roster of person ids, not a reference to this
 * entity. Teams exist so ownership (of an action or blocker) can be assigned
 * to a group rather than always forcing a single named individual.
 */
export interface Team {
  id: string;
  name: string;
  description: string;
  leadId: string | null; // personId
  memberIds: string[]; // personIds
}

export interface HealthCheck {
  scope: ProjectHealth;
  timeline: ProjectHealth;
  resources: ProjectHealth;
  quality: ProjectHealth;
  dependencies: ProjectHealth;
  risks: ProjectHealth;
  budget: ProjectHealth;
}

export interface Metric {
  id: string;
  label: string;
  value: string;
  hint?: string;
}

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  status: MilestoneStatus;
  progress: number; // 0..100
}

/** A user-defined phase of a project's roadmap (name is free text, not an enum). */
export interface ProjectPhaseItem {
  id: string;
  name: string;
  startDate: string;
  deadline: string | null;
}

export interface Workstream {
  id: string;
  title: string;
  lead: string; // personId
  progress: number;
  summary: string;
}

/**
 * A project resource is not just a URL — it's a pointer to somewhere the team
 * actually works (a design file, a code repo, a shared drive…), so it carries
 * enough context (kind for the icon, an optional access/usage note) for
 * someone unfamiliar with the project to know what it is before opening it.
 */
export interface ProjectResource {
  id: string;
  kind: ResourceKind;
  title: string; // human-readable, e.g. "فایل اصلی طراحی محصول"
  url: string;
  description?: string; // access requirements, credentials notes, usage notes
}

export interface Project {
  id: string;
  name: string;
  versionLabel: string; // e.g. "نسخه ۲"
  versionNumber: number;
  previousVersionId: string | null;
  lifecycle: ProjectLifecycle;
  health: ProjectHealth;
  priority: Priority;
  phase: ProjectPhase;
  /** User-defined roadmap phases (name/start/deadline) — see ProjectPhaseItem. */
  phases: ProjectPhaseItem[];
  pmId: string;
  /** Not every project has an assigned owner yet — null means "unassigned", never an empty string. */
  poId: string | null;
  startDate: string;
  targetDate: string | null;
  deliveryDate: string | null;
  closedDate: string | null;
  completion: number; // 0..100
  statusSummary: string;
  currentFocus: string;
  nextMilestone: string;
  executiveSummary: string;
  healthCheck: HealthCheck;
  metrics: Metric[];
  milestones: Milestone[];
  workstreams: Workstream[];
  teamIds: string[];
  resources: ProjectResource[];
  finalResult: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Participant {
  personId: string;
  attended: boolean;
}

export interface Decision {
  id: string;
  /** null when the source meeting belongs to a Meeting Space, not a project. */
  projectId: string | null;
  meetingId: string | null;
  text: string; // decision title
  description: string; // optional elaboration
  deciderId: string;
  date: string;
  area: string; // related topic/area, Persian
  impact: RiskLevel; // reuses the same low/medium/high severity scale as Risk
  createdAt: string;
}

export interface ActionItem {
  id: string;
  /** null when the source meeting belongs to a Meeting Space, not a project. */
  projectId: string | null;
  meetingId: string | null;
  title: string;
  description: string;
  ownerId: string | null; // personId or teamId — see Assignee in queries.ts
  deadline: string | null;
  status: ActionStatus;
  priority: Priority;
  relatedDecisionId: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  note: string; // explanation captured with the latest status change
}

/** Directional dependency: `blockedActionId` is blocked by `blockingActionId`. */
export interface Dependency {
  id: string;
  projectId: string;
  blockingActionId: string;
  blockedActionId: string;
  note: string;
  createdAt: string;
}

export interface Risk {
  id: string;
  projectId: string;
  meetingId: string | null;
  title: string;
  impact: RiskLevel;
  probability: RiskLevel;
  status: RiskStatus;
  ownerId: string | null;
  mitigation: string;
  createdAt: string;
}

export interface Blocker {
  id: string;
  /** null when the source meeting belongs to a Meeting Space, not a project. */
  projectId: string | null;
  meetingId: string | null;
  title: string;
  description: string;
  status: BlockerStatus;
  ownerId: string | null; // personId or teamId — see Assignee in queries.ts
  raisedDate: string;
  resolvedDate: string | null;
  note: string; // explanation captured with the latest status change
}

export interface Comment {
  id: string;
  meetingId: string;
  authorId: string;
  authorName: string; // denormalised for reviewer-supplied names
  body: string;
  createdAt: string;
}

/** A reviewer's disagreement note tied to one specific Decision (by id). */
export interface DecisionFeedback {
  decisionId: string;
  feedback: string;
}

/**
 * The canonical reviewer/approval artifact. It doubles as the "review response":
 * `status` records approve vs. changes-requested; when a reviewer submits
 * structured disagreement, `generalFeedback` and `decisionFeedback` carry the
 * detail so the PM sees exactly which decisions are contested. Both are
 * optional so existing signatures (and the approve path) stay unchanged.
 */
export interface Signature {
  id: string;
  meetingId: string;
  approverId: string;
  approverName: string;
  role: Role;
  status: ApprovalStatus;
  comment: string;
  signedAt: string | null;
  revision: number; // meeting revision the signature attests to
  /** Optional free-text note about the meeting overall (changes-requested path). */
  generalFeedback?: string;
  /** Optional per-decision disagreement notes (changes-requested path). */
  decisionFeedback?: DecisionFeedback[];
}

/**
 * A meeting is the same entity whether it belongs to a Project or an
 * independent Meeting Space — exactly one of projectId/spaceId is set.
 */
export interface Meeting {
  id: string;
  projectId: string | null;
  spaceId: string | null;
  sequence: number;
  title: string;
  date: string;
  time: string;
  location: string;
  status: MeetingStatus;
  revision: number;
  source: "manual" | "assistant";
  participants: Participant[];
  agenda: string[];
  discussion: string;
  summary: string; // derived flat text (legacy display / review page)
  summaryPoints: string[]; // structured summary items shown/edited as a list
  nextSteps: string[];
  createdById: string;
  createdAt: string;
  updatedAt: string;
  reviewToken: string;
}

export interface ProjectApproval {
  id: string;
  projectId: string;
  approverId: string;
  approverName: string;
  status: ApprovalStatus;
  comment: string;
  signedAt: string | null;
}

export interface Activity {
  id: string;
  projectId: string;
  meetingId: string | null;
  type: ActivityType;
  actorId: string;
  actorName: string;
  entityLabel: string;
  previousValue: string | null;
  newValue: string | null;
  createdAt: string;
}

/**
 * Meeting Space: an independent category of meetings that is not tied to a
 * project (e.g. "جلسات داخلی سازمان"). It is a container only — the meetings
 * inside it are ordinary Meeting records (spaceId set, projectId null), so
 * creation, editing, decisions, actions, and approval all behave identically
 * to project meetings.
 */
export interface MeetingSpace {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

// ── The persisted database shape ────────────────────────────────────────────
export interface Database {
  people: Person[];
  teams: Team[];
  projects: Project[];
  meetings: Meeting[];
  decisions: Decision[];
  actions: ActionItem[];
  dependencies: Dependency[];
  risks: Risk[];
  blockers: Blocker[];
  comments: Comment[];
  signatures: Signature[];
  projectApprovals: ProjectApproval[];
  activities: Activity[];
  meetingSpaces: MeetingSpace[];
}
