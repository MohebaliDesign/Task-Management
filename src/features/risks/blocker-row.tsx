import { AppIcon } from "@/components/icon";
import { BlockerStatusBadge } from "@/components/domain/status";
import { PersonChip } from "@/components/domain/person";
import { faDate } from "@/lib/utils";
import type { Blocker, Person } from "@/lib/domain";

/**
 * Single blocker row rendering — shared by the project Blockers tab and the
 * Meeting Detail page, so a blocker looks and reads identically everywhere.
 */
export function BlockerRow({ blocker, owner }: { blocker: Blocker; owner?: Person }) {
  return (
    <div className="flex items-start gap-3 p-4">
      <AppIcon name="blocker" size={20} className={`mt-0.5 shrink-0 ${blocker.status === "open" ? "text-destructive-text" : "text-muted-foreground"}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium">{blocker.title}</p>
          <BlockerStatusBadge value={blocker.status} />
        </div>
        {blocker.description && <p className="mt-1 text-sm text-muted-foreground">{blocker.description}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">مسئول: <PersonChip person={owner} variant="compact" /></span>
          <span>مطرح‌شده: {faDate(blocker.raisedDate)}</span>
        </div>
      </div>
    </div>
  );
}
