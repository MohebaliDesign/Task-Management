import { AppIcon } from "@/components/icon";
import { faDate } from "@/lib/utils";
import { ActivityItem } from "./activity-item";
import type { Activity } from "@/lib/domain";

/** "امروز" / "دیروز" / full Persian date — item #50. */
function dayLabel(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diffDays = Math.round((startOf(now) - startOf(d)) / 86_400_000);
  if (diffDays === 0) return "امروز";
  if (diffDays === 1) return "دیروز";
  return faDate(iso);
}

function groupByDay(activities: Activity[]): { label: string; items: Activity[] }[] {
  const groups: { label: string; items: Activity[] }[] = [];
  for (const a of activities) {
    const label = dayLabel(a.createdAt);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(a);
    else groups.push({ label, items: [a] });
  }
  return groups;
}

/**
 * Compact chronological governance feed (item #49) — a date rail with events
 * grouped underneath, newest first. Replaces the old ActivityTimeline: same
 * "current state + historical evidence" purpose, denser and better-organized.
 */
export function ActivityFeed({ activities, showProjectContext = true }: { activities: Activity[]; showProjectContext?: boolean }) {
  const groups = groupByDay(activities);

  return (
    <div className="space-y-1">
      {groups.map((group) => (
        <section key={group.label} aria-label={group.label}>
          <div className="sticky top-0 z-10 -mx-1 flex items-center gap-2 bg-background/95 px-1 py-2 backdrop-blur-sm">
            <AppIcon name="calendar" size={13} className="text-muted-foreground" />
            <h2 className="text-xs font-semibold text-foreground">{group.label}</h2>
            <span className="h-px flex-1 bg-border" aria-hidden="true" />
          </div>
          <ol className="divide-y divide-border ps-1">
            {group.items.map((a) => (
              <ActivityItem key={a.id} activity={a} showProjectContext={showProjectContext} />
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
