import { cn } from "@/lib/utils";
import { toneClasses, toneDot, type Tone } from "@/lib/labels";

import {
  healthLabels,
  lifecycleLabels,
  phaseLabels,
  priorityLabels,
  meetingStatusLabels,
  actionStatusLabels,
  approvalStatusLabels,
  riskLevelLabels,
  riskStatusLabels,
  blockerStatusLabels,
  milestoneStatusLabels,
} from "@/lib/labels";

import type {
  ProjectHealth,
  ProjectLifecycle,
  ProjectPhase,
  Priority,
  MeetingStatus,
  ActionStatus,
  ApprovalStatus,
  RiskLevel,
  RiskStatus,
  BlockerStatus,
  MilestoneStatus,
} from "@/lib/domain";

type StatusEntry = { label: string; tone: Tone };
const UNKNOWN_STATUS: StatusEntry = { label: "نامشخص", tone: "neutral" };

/**
 * Persisted local db.json survives git pulls and can contain an enum value from
 * an older application build. A missing label mapping should never take down an
 * entire project/meeting page; render a neutral, explicit fallback instead.
 * Current valid values still resolve through the canonical label maps below.
 */
function resolveStatusEntry<T extends string>(map: Record<T, StatusEntry>, value: T): StatusEntry {
  return map[value] ?? UNKNOWN_STATUS;
}

/**
 * StatusPill — the single visual language for every state in the app.
 * Always renders a text label plus (optionally) a colored dot; color is never
 * the sole signal.
 */
export function StatusPill({
  label,
  tone,
  dot = true,
  className,
}: {
  label: string;
  tone: Tone;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium",
        toneClasses[tone],
        className,
      )}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            toneDot[tone],
          )}
          aria-hidden="true"
        />
      )}
      {label}
    </span>
  );
}

export function HealthBadge({
  value,
  className,
}: {
  value: ProjectHealth;
  className?: string;
}) {
  const e = resolveStatusEntry(healthLabels, value);
  return <StatusPill label={e.label} tone={e.tone} className={className} />;
}

export function LifecycleBadge({ value }: { value: ProjectLifecycle }) {
  const e = resolveStatusEntry(lifecycleLabels, value);
  return <StatusPill label={e.label} tone={e.tone} />;
}

export function PhaseBadge({ value }: { value: ProjectPhase }) {
  const e = resolveStatusEntry(phaseLabels, value);
  return <StatusPill label={e.label} tone={e.tone} dot={false} />;
}

export function PriorityBadge({ value }: { value: Priority }) {
  const e = resolveStatusEntry(priorityLabels, value);
  return <StatusPill label={e.label} tone={e.tone} />;
}

export function MeetingStatusBadge({ value }: { value: MeetingStatus }) {
  const e = resolveStatusEntry(meetingStatusLabels, value);
  return <StatusPill label={e.label} tone={e.tone} />;
}

/**
 * A lighter-weight alternative to StatusPill for dense lists (Follow-ups):
 * dot + label with no border/background, so a table of many rows doesn't
 * turn into a wall of colored boxes. Still text + color together.
 */
export function StatusDot({ label, tone, className }: { label: string; tone: Tone; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs text-muted-foreground", className)}>
      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", toneDot[tone])} aria-hidden="true" />
      {label}
    </span>
  );
}

export function ActionStatusBadge({ value }: { value: ActionStatus }) {
  const e = resolveStatusEntry(actionStatusLabels, value);
  return <StatusPill label={e.label} tone={e.tone} />;
}

export function ActionStatusDot({ value, className }: { value: ActionStatus; className?: string }) {
  const e = resolveStatusEntry(actionStatusLabels, value);
  return <StatusDot label={e.label} tone={e.tone} className={className} />;
}

export function ApprovalBadge({ value }: { value: ApprovalStatus }) {
  const e = resolveStatusEntry(approvalStatusLabels, value);
  return <StatusPill label={e.label} tone={e.tone} />;
}

export function RiskLevelBadge({
  value,
  prefix,
}: {
  value: RiskLevel;
  prefix?: string;
}) {
  const e = resolveStatusEntry(riskLevelLabels, value);

  return (
    <StatusPill
      label={prefix ? `${prefix}: ${e.label}` : e.label}
      tone={e.tone}
      dot={false}
    />
  );
}

export function RiskStatusBadge({ value }: { value: RiskStatus }) {
  const e = resolveStatusEntry(riskStatusLabels, value);
  return <StatusPill label={e.label} tone={e.tone} />;
}

export function BlockerStatusBadge({ value }: { value: BlockerStatus }) {
  const e = resolveStatusEntry(blockerStatusLabels, value);
  return <StatusPill label={e.label} tone={e.tone} />;
}

export function BlockerStatusDot({ value, className }: { value: BlockerStatus; className?: string }) {
  const e = resolveStatusEntry(blockerStatusLabels, value);
  return <StatusDot label={e.label} tone={e.tone} className={className} />;
}

export function MilestoneStatusBadge({ value }: { value: MilestoneStatus }) {
  const e = resolveStatusEntry(milestoneStatusLabels, value);
  return <StatusPill label={e.label} tone={e.tone} />;
}
