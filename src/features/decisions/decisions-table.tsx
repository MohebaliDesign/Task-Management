import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/icon";
import { PersonChip } from "@/components/domain/person";
import { RiskLevelBadge } from "@/components/domain/status";
import { faDate } from "@/lib/utils";
import { getPerson, getMeeting, getActions } from "@/lib/queries";
import type { Decision } from "@/lib/domain";

export function DecisionsTable({ decisions, projectId }: { decisions: Decision[]; projectId: string }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>تصمیم</TableHead>
          <TableHead>مسئول</TableHead>
          <TableHead>جلسه</TableHead>
          <TableHead>مهلت</TableHead>
          <TableHead>اثر</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {decisions.map((d) => {
          const owner = getPerson(d.deciderId);
          const meeting = getMeeting(d.meetingId);
          const nearestDeadline = getActions(projectId)
            .filter((a) => a.relatedDecisionId === d.id)
            .map((a) => a.deadline)
            .filter((x): x is string => !!x)
            .sort()[0];

          return (
            <TableRow key={d.id}>
              <TableCell className="min-w-[260px] max-w-sm">
                <p className="line-clamp-2 text-sm">{d.text}</p>
              </TableCell>
              <TableCell className="min-w-[140px]"><PersonChip person={owner} /></TableCell>
              <TableCell className="min-w-[160px] text-sm text-muted-foreground">{meeting?.title ?? "—"}</TableCell>
              <TableCell className="min-w-[110px] text-sm text-muted-foreground">{nearestDeadline ? faDate(nearestDeadline) : "—"}</TableCell>
              <TableCell><RiskLevelBadge value={d.impact} /></TableCell>
              <TableCell>
                {meeting && (
                  <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs">
                    <Link href={`/projects/${projectId}/meetings/${meeting.id}#decision-${d.id}`}>
                      جزئیات <AppIcon name="chevronLeft" size={13} />
                    </Link>
                  </Button>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
