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
  const e = healthLabels[value];
  return <StatusPill label={e.label} tone={e.tone} className={className} />;
}

export function LifecycleBadge({ value }: { value: ProjectLifecycle }) {
  const e = lifecycleLabels[value];
  return <StatusPill label={e.label} tone={e.tone} />;
}

export function PhaseBadge({ value }: { value: ProjectPhase }) {
  const e = phaseLabels[value];
  return <StatusPill label={e.label} tone={e.tone} dot={false} />;
}

export function PriorityBadge({ value }: { value: Priority }) {
  const e = priorityLabels[value];
  return <StatusPill label={e.label} tone={e.tone} />;
}

export function MeetingStatusBadge({ value }: { value: MeetingStatus }) {
  const e = meetingStatusLabels[value];
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
  const e = actionStatusLabels[value];
  return <StatusPill label={e.label} tone={e.tone} />;
}

export function ActionStatusDot({ value, className }: { value: ActionStatus; className?: string }) {
  const e = actionStatusLabels[value];
  return <StatusDot label={e.label} tone={e.tone} className={className} />;
}

export function ApprovalBadge({ value }: { value: ApprovalStatus }) {
  const e = approvalStatusLabels[value];
  return <StatusPill label={e.label} tone={e.tone} />;
}

export function RiskLevelBadge({
  value,
  prefix,
}: {
  value: RiskLevel;
  prefix?: string;
}) {
  const e = riskLevelLabels[value];

  return (
    <StatusPill
      label={prefix ? `${prefix}: ${e.label}` : e.label}
      tone={e.tone}
      dot={false}
    />
  );
}

export function RiskStatusBadge({ value }: { value: RiskStatus }) {
  const e = riskStatusLabels[value];
  return <StatusPill label={e.label} tone={e.tone} />;
}

export function BlockerStatusBadge({ value }: { value: BlockerStatus }) {
  const e = blockerStatusLabels[value];
  return <StatusPill label={e.label} tone={e.tone} />;
}

export function BlockerStatusDot({ value, className }: { value: BlockerStatus; className?: string }) {
  const e = blockerStatusLabels[value];
  return <StatusDot label={e.label} tone={e.tone} className={className} />;
}

export function MilestoneStatusBadge({ value }: { value: MilestoneStatus }) {
  const e = milestoneStatusLabels[value];
  return <StatusPill label={e.label} tone={e.tone} />;
}