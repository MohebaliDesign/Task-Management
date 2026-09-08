import { Progress } from "@/components/ui/progress";
import { MilestoneStatusBadge } from "@/components/domain/status";
import { faDate } from "@/lib/utils";
import type { Milestone } from "@/lib/domain";

export function MilestoneRow({ milestone }: { milestone: Milestone }) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">{milestone.title}</p>
        <MilestoneStatusBadge value={milestone.status} />
      </div>
      <div className="mt-2 flex items-center gap-3">
        <Progress value={milestone.progress} className="h-1.5" />
        <span className="shrink-0 text-xs text-muted-foreground">{faDate(milestone.dueDate)}</span>
      </div>
    </div>
  );
}
