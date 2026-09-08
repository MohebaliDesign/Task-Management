import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/icon";
import { PersonChip } from "@/components/domain/person";
import { faDate } from "@/lib/utils";
import { riskLevelLabels } from "@/lib/labels";
import { getPerson, getMeeting, getActions } from "@/lib/queries";
import type { Decision, RiskLevel } from "@/lib/domain";

/**
 * A colored start-edge stripe carries the impact signal at a glance without
 * a badge chip competing for attention; a screen-reader-only label keeps it
 * from being color-only (color is never the sole signal in this app).
 */
const impactAccent: Record<RiskLevel, string> = {
  low: "border-s-success",
  medium: "border-s-warning",
  high: "border-s-destructive",
};

/**
 * Trimmed to exactly what the brief calls the "at a glance" set — the
 * decision itself, its owner, the meeting it came from, and its deadline.
 * Everything else (impact detail, agreement/signature status) lives behind
 * "مشاهده جزئیات" on the meeting page, not on this card.
 */
export function DecisionCard({ decision, projectId }: { decision: Decision; projectId: string }) {
  const owner = getPerson(decision.deciderId);
  const meeting = getMeeting(decision.meetingId);
  const nearestDeadline = getActions(projectId)
    .filter((a) => a.relatedDecisionId === decision.id)
    .map((a) => a.deadline)
    .filter((d): d is string => !!d)
    .sort()[0];

  return (
    <Card className={`flex h-full flex-col gap-3 border-s-4 p-4 ${impactAccent[decision.impact]}`}>
      <span className="sr-only">میزان اثر: {riskLevelLabels[decision.impact].label}</span>

      <p className="line-clamp-3 text-sm font-medium leading-6">{decision.text}</p>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
        <PersonChip person={owner} />
        {meeting && (
          <span className="flex items-center gap-1">
            <AppIcon name="meetings" size={13} /> {meeting.title}
          </span>
        )}
        {nearestDeadline && (
          <span className="flex items-center gap-1">
            <AppIcon name="clock" size={13} /> مهلت: {faDate(nearestDeadline)}
          </span>
        )}
      </div>

      {meeting && (
        <div className="mt-auto flex justify-end border-t border-border pt-3">
          <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs">
            <Link href={`/projects/${projectId}/meetings/${meeting.id}#decision-${decision.id}`}>
              مشاهده جزئیات
              <AppIcon name="chevronLeft" size={13} />
            </Link>
          </Button>
        </div>
      )}
    </Card>
  );
}
